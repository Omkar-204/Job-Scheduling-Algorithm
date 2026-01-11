# Job Scheduling with Deadline (Profit Maximization)

![Project Status](https://img.shields.io/badge/Status-Completed-success)
![Language](https://img.shields.io/badge/Language-HTML%20%7C%20CSS%20%7C%20JavaScript-blue)

## 📋 Overview

This project is an interactive web application designed to visualize the **Job Sequencing with Deadlines** problem. It implements a **Greedy Algorithm** to find the optimal sequence of jobs that maximizes total profit. 

The tool was created to bridge the gap between theoretical algorithm concepts and practical visualization, allowing users to define their own job datasets and watch the algorithm solve the problem step-by-step.



## 🚀 Features

* **Dynamic Data Entry:** Add, remove, and manage a list of jobs with specific IDs, Profits, and Deadlines.
* **Algorithm Visualization:**
    * **Sorting Phase:** See how the algorithm prioritizes high-profit jobs.
    * **Slot Allocation:** Watch the timeline fill up as jobs are assigned to the latest possible free slots.
* **Step-by-Step Simulation:** Control the speed of the algorithm using "Next Step" controls to understand the logic flow.
* **Detailed Logs:** A console-like log view explains the decision-making process for every job (Accepted vs. Rejected).
* **Theoretical Context:** Includes built-in documentation about the algorithm, including Time ($O(n^2)$) and Space ($O(n)$) complexity.

---

## 🛠️ How It Works (The Algorithm)

The application solves the problem using the following Greedy strategy:

1.  **Sort:** All jobs are sorted in descending order of **Profit**.
2.  **Initialize:** A timeline is created with a size equal to the maximum deadline present in the data.
3.  **Iterate:** For each job in the sorted list:
    * Check available time slots starting from `min(max_deadline, job_deadline) - 1` down to `0`.
    * If an empty slot (`-1`) is found, assign the job to that slot.
    * If no slot is found, the job is rejected (skipped).
4.  **Result:** The sum of profits of all scheduled jobs is the Maximum Profit.

---

## 💻 Tech Stack

* **HTML5:** Semantic structure and layout.
* **CSS3:** Custom styling with Flexbox for layout and Keyframes for animations (`fadeIn`, `popIn`).
* **JavaScript (Vanilla):** DOM manipulation, algorithm logic, and state management for the simulation.

---

## 📂 File Structure

```text
├── job-scheduling-page (finl).html  # Main entry point and UI structure
├── style.css                        # Styling, themes, and animations
├── java.js                          # Application logic and simulation engine
└── README.md                        # Project documentation
