# ImagePipeline - Full Stack Intern Assignment

## Job Description

For the detailed job description, please refer to the following [link](https://festive-spectrum-d2d.notion.site/Full-Stack-Front-End-Focused-Intern-Assignment-15a433b38640806184eeed76e2c76fba).

## Table of Contents

- [Technologies & Libraries Used](#technologies-used)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
- [Challenges](#challenges)

## Technologies & Libraries Used

- React.js
- TypeScript
- Tailwind CSS
- Shadcn Library
- React Canvas Draw Library

## Getting Started

### Prerequisites

- Node.js (v18 or later)
- npm
- Git

### Installation

#### 1. Clone the repository.

```bash
git clone https://github.com/kvardaan/Image-Pipeline-Full-Stack-Assignment.git
cd Image-Pipeline-Full-Stack-Assignment
```

#### 2. Install dependencies.

```bash
npm install --legacy-peer-deps
```
  
The flag `--legacy-peer-deps` is being used as the `react-canvas-draw` package is now deprecated.

The application will be available at `http://localhost:5173`.

## Challenges

There were some challenges that I faced during this assignment -

- Working with the image data which was saved in the browser temporarily, during transfer from one component to another.
  - I managed through it by passing its browser generated url.
- Another challenge was to make the mask with a background (`black` as mentioned in the JD).
  - It was done by making a copy of the canvas and adding the `fillStyle` propery to the copied canvas. 