---
title: Locomotion in Humanoid Robots
---

# Locomotion in Humanoid Robots

Locomotion is one of the most challenging aspects of humanoid robotics. Unlike wheeled robots, humanoid robots must maintain balance while moving on two legs, mimicking human walking patterns.

## Types of Locomotion

- **Static Walking**: The robot maintains balance by ensuring the center of mass is always within the support polygon
- **Dynamic Walking**: The robot uses dynamic balance, allowing the center of mass to move outside the support polygon during walking
- **Bipedal Running**: More complex than walking, requiring precise control to maintain balance at higher speeds

## Control Strategies

### Zero-Moment Point (ZMP)

The ZMP is a criterion used to assess the stability of biped locomotion. Controllers ensure that the ZMP remains within the support polygon formed by the robot's feet.

### Linear Inverted Pendulum Model (LIPM)

This model simplifies the complex dynamics of a humanoid robot to a point mass with a variable height, making the control problem more tractable.

## Challenges

- Disturbance rejection
- Uneven terrain navigation
- Energy efficiency
- Real-time control