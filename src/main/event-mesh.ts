/**
 * TUM Central Director — Sovereign Cross-Fleet Event Mesh
 * High-Throughput In-Memory Sovereign Event Bus linking all 8 TUM products
 */

import crypto from 'node:crypto';

export type FleetTopic =
  | 'CYBERMESH_SOAR_CONTAINMENT'
  | 'WORKOS_TREASURY_CRUNCH'
  | 'TRUST_FABRIC_CITIZEN_CLEARED'
  | 'QUANTUM_KEY_ROTATED'
  | 'DIRECTOR_POLICY_ENFORCED';

export interface FleetEvent<T = Record<string, unknown>> {
  readonly id: string;
  readonly topic: FleetTopic;
  readonly sourceRepo: string;
  readonly payload: T;
  readonly timestamp: string;
  readonly signatureSha256: string;
}

export type EventHandler<T = Record<string, unknown>> = (event: FleetEvent<T>) => Promise<void> | void;

export class FleetEventMesh {
  private static instance: FleetEventMesh;
  private subscribers: Map<FleetTopic, Map<string, EventHandler<any>>> = new Map();
  private eventHistory: FleetEvent<any>[] = [];
  private readonly maxHistory: number = 500;

  private constructor() {}

  public static getInstance(): FleetEventMesh {
    if (!FleetEventMesh.instance) {
      FleetEventMesh.instance = new FleetEventMesh();
    }
    return FleetEventMesh.instance;
  }

  public subscribe<T = Record<string, unknown>>(
    topic: FleetTopic,
    subscriberId: string,
    handler: EventHandler<T>
  ): void {
    if (!this.subscribers.has(topic)) {
      this.subscribers.set(topic, new Map());
    }
    this.subscribers.get(topic)!.set(subscriberId, handler as EventHandler<any>);
  }

  public unsubscribe(topic: FleetTopic, subscriberId: string): boolean {
    const topicSubs = this.subscribers.get(topic);
    if (!topicSubs) return false;
    return topicSubs.delete(subscriberId);
  }

  public async publish<T = Record<string, unknown>>(
    topic: FleetTopic,
    sourceRepo: string,
    payload: T
  ): Promise<FleetEvent<T>> {
    const id = `EVT-${crypto.randomUUID()}`;
    const timestamp = new Date().toISOString();
    const payloadStr = JSON.stringify(payload);
    const signatureSha256 = crypto
      .createHash('sha256')
      .update(`${id}:${topic}:${sourceRepo}:${payloadStr}:${timestamp}`)
      .digest('hex');

    const event: FleetEvent<T> = {
      id,
      topic,
      sourceRepo,
      payload,
      timestamp,
      signatureSha256
    };

    // Store in history ring buffer
    this.eventHistory.push(event);
    if (this.eventHistory.length > this.maxHistory) {
      this.eventHistory.shift();
    }

    // Deliver to subscribers
    const topicSubs = this.subscribers.get(topic);
    if (topicSubs) {
      const promises: Promise<void>[] = [];
      for (const handler of topicSubs.values()) {
        try {
          const res = handler(event);
          if (res instanceof Promise) {
            promises.push(res);
          }
        } catch (err) {
          console.error(`[FleetEventMesh] Handler error on topic ${topic}:`, err);
        }
      }
      if (promises.length > 0) {
        await Promise.allSettled(promises);
      }
    }

    return event;
  }

  public getHistory(limit: number = 50): readonly FleetEvent<any>[] {
    return this.eventHistory.slice(-limit);
  }

  public clear(): void {
    this.subscribers.clear();
    this.eventHistory = [];
  }
}
