 // Store jobs
 let jobs = [];

 // Dom elements
 const jobIdInput = document.getElementById('jobId');
 const profitInput = document.getElementById('profit');
 const deadlineInput = document.getElementById('deadline');
 const addJobButton = document.getElementById('addJob');
 const jobTableBody = document.getElementById('jobTableBody');
 const calculateButton = document.getElementById('calculateSchedule');
 const resultSection = document.getElementById('resultSection');
 const optimalSequence = document.getElementById('optimalSequence');
 const maxProfit = document.getElementById('maxProfit');
 
 // Simulation elements
 const simulationContainer = document.getElementById('simulationContainer');
 const startSimulationButton = document.getElementById('startSimulation');
 const nextStepButton = document.getElementById('nextStep');
 const resetSimulationButton = document.getElementById('resetSimulation');
 const sortedJobsContainer = document.getElementById('sortedJobs');
 const timelineHeader = document.getElementById('timelineHeader');
 const timelineContent = document.getElementById('timelineContent');
 const simulationLogs = document.getElementById('simulationLogs');

 // Add sample jobs
 function addSampleJobs() {
     const sampleJobs = [
         { id: 'J1', profit: 50, deadline: 2 },
         { id: 'J2', profit: 15, deadline: 1 },
         { id: 'J3', profit: 30, deadline: 2 },
         { id: 'J4', profit: 25, deadline: 1 },
         { id: 'J5', profit: 10, deadline: 3 }
     ];
     
     jobs = sampleJobs;
     renderJobTable();
 }

 // Add a new job
 addJobButton.addEventListener('click', () => {
     const id = jobIdInput.value;
     const profit = parseInt(profitInput.value);
     const deadline = parseInt(deadlineInput.value);
     
     if (!id || isNaN(profit) || isNaN(deadline)) {
         alert('Please fill all fields with valid values');
         return;
     }
     
     if (jobs.some(job => job.id === id)) {
         alert('Job ID must be unique');
         return;
     }
     
     jobs.push({ id, profit, deadline });
     
     // Clear inputs
     jobIdInput.value = '';
     profitInput.value = '';
     deadlineInput.value = '';
     
     renderJobTable();
 });

 // Render the job table
 function renderJobTable() {
     jobTableBody.innerHTML = '';
     
     jobs.forEach((job, index) => {
         const row = document.createElement('tr');
         
         row.innerHTML = `
             <td>${job.id}</td>
             <td>${job.profit}</td>
             <td>${job.deadline}</td>
             <td><button class="delete-btn" data-index="${index}">Remove</button></td>
         `;
         
         jobTableBody.appendChild(row);
     });
     
     // Add event listeners to delete buttons
     document.querySelectorAll('.delete-btn').forEach(btn => {
         btn.addEventListener('click', () => {
             const index = parseInt(btn.dataset.index);
             jobs.splice(index, 1);
             renderJobTable();
         });
     });
 }

 // Schedule jobs algorithm
 function scheduleJobs(jobs) {
     // Sort jobs in decreasing order of profit
     jobs.sort((a, b) => b.profit - a.profit);
     
     // Find the maximum deadline
     const maxDeadline = Math.max(...jobs.map(job => job.deadline));
     
     // Initialize result array with -1 (empty slots)
     const result = new Array(maxDeadline).fill(-1);
     
     // Initialize total profit
     let totalProfit = 0;
     
     // Schedule each job
     for (const job of jobs) {
         // Find the latest available slot before deadline
         for (let i = Math.min(maxDeadline, job.deadline) - 1; i >= 0; i--) {
             if (result[i] === -1) {
                 result[i] = job.id;
                 totalProfit += job.profit;
                 break;
             }
         }
     }
     
     // Filter out empty slots
     const scheduledJobs = result.filter(id => id !== -1);
     
     return {
         schedule: scheduledJobs,
         totalProfit: totalProfit
     };
 }

 // Calculate optimal schedule
 calculateButton.addEventListener('click', () => {
     if (jobs.length === 0) {
         alert('Please add some jobs first');
         return;
     }
     
     const result = scheduleJobs([...jobs]);
     
     optimalSequence.textContent = result.schedule.join(' → ');
     maxProfit.textContent = result.totalProfit;
     
     resultSection.style.display = 'block';
     simulationContainer.style.display = 'block';
 });

 // Simulation variables
 let sortedJobs = [];
 let timeSlots = [];
 let currentJobIndex = 0;
 let simulationInProgress = false;

 // Start simulation
 startSimulationButton.addEventListener('click', () => {
     if (jobs.length === 0) {
         alert('Please calculate the optimal schedule first');
         return;
     }
     
     // Reset simulation state
     resetSimulation();
     
     // Enable/disable buttons
     startSimulationButton.disabled = true;
     nextStepButton.disabled = false;
     resetSimulationButton.disabled = false;
     
     // Sort jobs by profit
     sortedJobs = [...jobs].sort((a, b) => b.profit - a.profit);
     
     // Display sorted jobs
     renderSortedJobs();
     
     // Initialize timeline
     initializeTimeline();
     
     // Add initial log
     addLog('Simulation started. Jobs sorted by profit (highest to lowest).');
     
     simulationInProgress = true;
 });

 // Reset simulation
 resetSimulationButton.addEventListener('click', () => {
     resetSimulation();
 });

 function resetSimulation() {
     // Reset variables
     currentJobIndex = 0;
     timeSlots = [];
     simulationInProgress = false;
     
     // Clear UI
     sortedJobsContainer.innerHTML = '';
     timelineHeader.innerHTML = '';
     timelineContent.innerHTML = '';
     simulationLogs.innerHTML = '';
     
     // Reset buttons
     startSimulationButton.disabled = false;
     nextStepButton.disabled = true;
     resetSimulationButton.disabled = true;
 }

 // Next step button
 nextStepButton.addEventListener('click', () => {
     if (!simulationInProgress) return;
     
     if (currentJobIndex < sortedJobs.length) {
         processNextJob();
     } else {
         // Simulation complete
         addLog('Simulation complete! All jobs have been processed.');
         nextStepButton.disabled = true;
     }
 });

 // Process next job in simulation
 function processNextJob() {
     const job = sortedJobs[currentJobIndex];
     
     // Highlight current job being processed
     highlightCurrentJob();
     
     addLog(`Processing Job ${job.id} (Profit: ${job.profit}, Deadline: ${job.deadline})`);
     
     // Try to find a slot for this job
     let slotFound = false;
     for (let i = Math.min(job.deadline, timeSlots.length) - 1; i >= 0; i--) {
         if (timeSlots[i] === null) {
             // Assign job to this slot
             timeSlots[i] = job;
             slotFound = true;
             
             // Update timeline
             updateTimeline(i, job);
             
             addLog(`Job ${job.id} assigned to time slot ${i+1} (Latest available slot before deadline)`);
             break;
         }
     }
     
     if (!slotFound) {
         addLog(`No available time slot found for Job ${job.id} before its deadline. Job rejected.`);
     }
     
     // Move to next job
     currentJobIndex++;
     
     // If all jobs processed, show summary
     if (currentJobIndex >= sortedJobs.length) {
         // Calculate total profit
         const totalProfit = timeSlots.reduce((sum, job) => sum + (job ? job.profit : 0), 0);
         addLog(`All jobs processed. Total profit: ${totalProfit}`);
     }
 }

 // Initialize timeline for simulation
 function initializeTimeline() {
     // Get max deadline
     const maxDeadline = Math.max(...sortedJobs.map(job => job.deadline));
     
     // Create timeline slots
     timelineHeader.innerHTML = '';
     timelineContent.innerHTML = '';
     
     for (let i = 0; i < maxDeadline; i++) {
         // Create header slot
         const headerSlot = document.createElement('div');
         headerSlot.className = 'timeline-slot';
         headerSlot.textContent = `Time ${i+1}`;
         timelineHeader.appendChild(headerSlot);
         
         // Create content slot
         const contentSlot = document.createElement('div');
         contentSlot.className = 'timeline-item';
         contentSlot.id = `time-slot-${i}`;
         timelineContent.appendChild(contentSlot);
         
         // Initialize time slots array
         timeSlots.push(null);
     }
 }

 // Render sorted jobs
 function renderSortedJobs() {
     sortedJobsContainer.innerHTML = '';
     
     sortedJobs.forEach((job, index) => {
         const jobCard = document.createElement('div');
         jobCard.className = 'sorted-job-card';
         jobCard.id = `sorted-job-${index}`;
         
         jobCard.innerHTML = `
             <div class="sorted-job-id">${job.id}</div>
             <div class="sorted-job-details">
                 Profit: ${job.profit} | Deadline: ${job.deadline}
             </div>
         `;
         
         sortedJobsContainer.appendChild(jobCard);
     });
 }

 // Highlight current job in sorted list
 function highlightCurrentJob() {
     // Reset all highlights
     document.querySelectorAll('.sorted-job-card').forEach(card => {
         card.style.backgroundColor = '#3498db';
     });
     
     // Highlight current job
     const currentJobCard = document.getElementById(`sorted-job-${currentJobIndex}`);
     if (currentJobCard) {
         currentJobCard.style.backgroundColor = '#e74c3c';
     }
 }

 // Update timeline with new job assignment
 function updateTimeline(timeIndex, job) {
     const timeSlot = document.getElementById(`time-slot-${timeIndex}`);
     
     if (timeSlot) {
         const jobElement = document.createElement('div');
         jobElement.className = 'timeline-job';
         jobElement.innerHTML = `
             <div><strong>${job.id}</strong></div>
             <div>${job.profit}</div>
         `;
         
         timeSlot.appendChild(jobElement);
     }
 }

 // Add log message
 function addLog(message) {
     const logEntry = document.createElement('div');
     logEntry.className = 'simulation-step';
     
     // If it's a job processing log
     if (message.startsWith('Processing Job')) {
         const jobId = sortedJobs[currentJobIndex].id;
         
         logEntry.innerHTML = `
             <div class="job-info">
                 <strong>${jobId}</strong>
             </div>
             <div class="step-description">${message}</div>
         `;
     } else if (message.includes('assigned to time slot')) {
         logEntry.innerHTML = `
             <div class="step-description">${message}</div>
             <span class="job-check">✓</span>
         `;
     } else if (message.includes('No available time slot')) {
         logEntry.innerHTML = `
             <div class="step-description">${message}</div>
             <span class="job-x">✗</span>
         `;
     } else {
         logEntry.innerHTML = `<div class="step-description">${message}</div>`;
     }
     
     simulationLogs.appendChild(logEntry);
     
     // Scroll to bottom
     simulationLogs.scrollTop = simulationLogs.scrollHeight;
 }

 // Initialize with sample jobs
 addSampleJobs();