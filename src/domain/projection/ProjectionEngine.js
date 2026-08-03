// @ts-nocheck
/*
======================================================================

METRA — ProjectionEngine.js

PURPOSE
-------

Repository projection notification coordinator.

Provides the notification contract expected by repository and
projection consumers.

This module does not own projections.

It only coordinates notification.

======================================================================
*/

const projections = new Set();
const subscribers = new Set();

export function registerProjection(callback) {
  if (typeof callback === "function") {
    projections.add(callback);
  }
}

export function subscribeProjectionChanged(callback) {
  if (typeof callback === "function") {
    subscribers.add(callback);
  }
}

export function unsubscribeProjectionChanged(callback) {
  subscribers.delete(callback);
}

export function notifyProjectionChanged() {
  projections.forEach((callback) => {
    try {
      callback();
    } catch (error) {
      console.error("Projection notification failed", error);
    }
  });
}
