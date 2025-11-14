const API_BASE_URL = 'http://127.0.0.1:5000/api';

// --- DOM Elements ---
const completionRateElem = document.getElementById('completionRate');
const avgScoreElem = document.getElementById('avgScore');
const dropoutRateElem = document.getElementById('dropoutRate');
const activeCountElem = document.getElementById('activeCount');
const activeStudentsCardCountElem = document.getElementById('activeStudentsCardCount');

const chartCompletionElem = document.getElementById('chart-completion');
const chartScoresElem = document.getElementById('chart-scores');
const chartDropoutElem = document.getElementById('chart-dropout');
const chartScoreDistributionElem = document.getElementById('chart-score-distribution');
const chartTestPrepElem = document.getElementById('chart-test-prep');

const aiInsightsElem = document.getElementById('aiInsights');
const loadingIndicator = document.getElementById('loading'); // Assuming a loading indicator
const errorDisplay = document.getElementById('error'); // Assuming an error display
const searchInput = document.getElementById('searchInput'); // Added searchInput
const searchResults = document.getElementById('searchResults'); // Added searchResults

// Predictor elements
const inputHours = document.getElementById('input-hours');
const inputQuiz = document.getElementById('input-quiz');
const inputDays = document.getElementById('input-days');
const predictBtn = document.getElementById('predictBtn');
const predictResult = document.getElementById('predictResult');

let currentStudentData = []; // To store student data fetched for AI insights

// --- Helper Functions ---
function showLoading() {
    // if (loadingIndicator) loadingIndicator.style.display = 'block';
    if (errorDisplay) errorDisplay.style.display = 'none';
}

function hideLoading() {
    // if (loadingIndicator) loadingIndicator.style.display = 'none';
}

function showError(message) {
    if (errorDisplay) {
        errorDisplay.textContent = `Error: ${message}`;
        errorDisplay.style.display = 'block';
    }
    console.error(message);
}

function clearError() {
    if (errorDisplay) {
        errorDisplay.style.display = 'none';
        errorDisplay.textContent = '';
    }
}

// --- API Calls ---
async function getDashboardData() {
    clearError();
    showLoading();
    try {
        const response = await fetch(`${API_BASE_URL}/dashboard-data`);
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || `Backend responded with status ${response.status}`);
        }
        const data = await response.json();
        return data;
    } catch (error) {
        showError(`Failed to fetch dashboard data: ${error.message}`);
        throw error;
    } finally {
        hideLoading();
    }
}

async function getTrendsData() {
    clearError();
    showLoading();
    try {
        const response = await fetch(`${API_BASE_URL}/trends-data`);
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || `Backend responded with status ${response.status}`);
        }
        const data = await response.json();
        return data;
    } catch (error) {
        showError(`Failed to fetch trends data: ${error.message}`);
        throw error;
    } finally {
        hideLoading();
    }
}

async function getScoresData() {
    clearError();
    showLoading();
    try {
        const response = await fetch(`${API_BASE_URL}/scores-data`);
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || `Backend responded with status ${response.status}`);
        }
        const data = await response.json();
        return data;
    } catch (error) {
        showError(`Failed to fetch scores data: ${error.message}`);
        throw error;
    } finally {
        hideLoading();
    }
}

async function getDropoutsData() {
    clearError();
    showLoading();
    try {
        const response = await fetch(`${API_BASE_URL}/dropouts-data`);
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || `Backend responded with status ${response.status}`);
        }
        const data = await response.json();
        return data;
    } catch (error) {
        showError(`Failed to fetch dropouts data: ${error.message}`);
        throw error;
    } finally {
        hideLoading();
    }
}

async function getLearningInsights(studentData) {
    try {
        const response = await fetch(`${API_BASE_URL}/ai-summary`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ studentData }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || `Backend responded with status ${response.status}`);
        }

        const data = await response.json();
        return data.summary;
    } catch (error) {
        console.error("Failed to fetch AI-powered insights from backend:", error);
        return `### AI Insights Error\nFailed to get insights from the backend: ${error.message || error}`;
    }
}

async function predictCompletion(hoursWatched, averageScore, daysActive) {
    try {
        const response = await fetch(`${API_BASE_URL}/predict`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                hours_watched: hoursWatched,
                average_score: averageScore,
                activity_level: daysActive
            }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || `Backend responded with status ${response.status}`);
        }

        const data = await response.json();
        return data.completion_likelihood;
    } catch (error) {
        showError(`Failed to get prediction: ${error.message}`);
        return null;
    }
}

// --- Rendering Functions ---
function renderStats(stats) {
    if (completionRateElem) completionRateElem.textContent = `${stats.completionRate}`;
    if (avgScoreElem) avgScoreElem.textContent = `${stats.averageScore}`;
    if (dropoutRateElem) dropoutRateElem.textContent = `${stats.dropoutRate}%`;
    if (activeCountElem) activeCountElem.textContent = `${stats.activeStudents}`; // Update topbar active count
    if (activeStudentsCardCountElem) activeStudentsCardCountElem.textContent = `${stats.activeStudents}`; // Update stat card active count
}

function renderAiInsights(insights) {
    if (aiInsightsElem) aiInsightsElem.innerHTML = insights;
}

function renderSearchResults(results) {
    if (!searchResults) return;

    const resultsContent = searchResults.querySelector('.search-results-content');
    resultsContent.innerHTML = ''; // Clear previous results

    if (results.length === 0) {
        resultsContent.innerHTML = '<p>No students found matching your search.</p>';
        searchResults.style.display = 'block';
        return;
    }

    const ul = document.createElement('ul');
    ul.style.listStyleType = 'none';
    ul.style.padding = '0';

    results.forEach(student => {
        const li = document.createElement('li');
        li.style.marginBottom = '10px';
        li.style.padding = '8px';
        li.style.border = '1px solid #eee';
        li.style.borderRadius = '4px';
        li.innerHTML = `
            <strong>Gender:</strong> ${student.gender || 'N/A'}<br>
            <strong>Race:</strong> ${student.race_ethnicity || 'N/A'}<br>
            <strong>Parental Education:</strong> ${student.parental_level_of_education || 'N/A'}<br>
            <strong>Lunch:</strong> ${student.lunch || 'N/A'}<br>
            <strong>Test Prep:</strong> ${student.test_preparation_course || 'N/A'}<br>
            <strong>Overall Score:</strong> ${student.overall_score ? student.overall_score.toFixed(1) : 'N/A'}
        `;
        ul.appendChild(li);
    });
    resultsContent.appendChild(ul);
    searchResults.style.display = 'block';
}

function renderTrendsCharts(data) {
    // Learning Completion Trend (chart-completion)
    if (chartCompletionElem && data.completionTrend) {
        const trace = {
            x: data.completionTrend.map(item => item.parental_level_of_education),
            y: data.completionTrend.map(item => item.completion_rate),
            type: 'bar',
            marker: { color: '#4F46E5' },
            name: 'Completion Rate'
        };
        const layout = {
            title: 'Completion Rate by Parental Education Level',
            xaxis: { title: 'Parental Education Level' },
            yaxis: { title: 'Completion Rate (%)' }
        };
        Plotly.newPlot(chartCompletionElem, [trace], layout);
    }

    // Average Scores (chart-scores)
    if (chartScoresElem && data.averageScoresBySubject) {
        const trace = {
            x: data.averageScoresBySubject.map(item => item.subject),
            y: data.averageScoresBySubject.map(item => item.average_score),
            type: 'bar',
            marker: { color: '#10B981' },
            name: 'Average Score'
        };
        const layout = {
            title: 'Average Scores by Subject',
            xaxis: { title: 'Subject' },
            yaxis: { title: 'Average Score' }
        };
        Plotly.newPlot(chartScoresElem, [trace], layout);
    }
}

function renderScoresCharts(data) {
    // Score Distribution (chart-score-distribution)
    if (chartScoreDistributionElem && data.scoreDistribution) {
        const trace = {
            x: data.scoreDistribution.map(item => item.score),
            y: data.scoreDistribution.map(item => item.count),
            type: 'bar', // Use bar chart for pre-aggregated counts
            marker: {
                color: '#4F46E5'
            },
            name: 'Score Distribution'
        };
        const layout = {
            title: 'Overall Score Distribution',
            xaxis: { title: 'Score' },
            yaxis: { title: 'Number of Students' }
        };
        Plotly.newPlot(chartScoreDistributionElem, [trace], layout);
    }

    // Performance by Test Preparation (chart-test-prep)
    if (chartTestPrepElem && data.performanceByTestPrep) {
        const trace = {
            x: data.performanceByTestPrep.map(item => item.test_preparation_course),
            y: data.performanceByTestPrep.map(item => item.average_score),
            type: 'bar',
            marker: { color: '#F59E0B' },
            name: 'Average Score'
        };
        const layout = {
            title: 'Performance by Test Preparation Course',
            xaxis: { title: 'Test Preparation Course' },
            yaxis: { title: 'Average Score' }
        };
        Plotly.newPlot(chartTestPrepElem, [trace], layout);
    }
}

function renderDropoutsCharts(data) {
    // Dropout Patterns by Education (chart-dropout)
    if (chartDropoutElem && data.dropoutByEducation) {
        const trace1 = {
            x: data.dropoutByEducation.map(item => item.parental_level_of_education),
            y: data.dropoutByEducation.map(item => item.dropout_rate),
            type: 'bar',
            marker: { color: '#EF4444' },
            name: 'Dropout Rate'
        };
        const layout1 = {
            title: 'Dropout Rate by Parental Education Level',
            xaxis: { title: 'Parental Education Level' },
            yaxis: { title: 'Dropout Rate (%)' }
        };
        Plotly.newPlot(chartDropoutElem, [trace1], layout1);
    }

    // Dropout Patterns by Gender (new chart element needed or combine)
    // For simplicity, let's add a new chart element in index.html or combine.
    // For now, I'll just log it or use the existing chartDropoutElem for gender if it's not too cluttered.
    // Let's assume we'll add a new chart element for gender in index.html later.
    // For now, I'll just render one chart for dropouts.
}


// --- Main Data Fetching and Rendering ---
async function fetchDataAndRender() {
    try {
        const dashboardData = await getDashboardData();
        renderStats(dashboardData.stats);
        currentStudentData = dashboardData.studentData; // Store for AI insights
        
        // Fetch AI insights separately
        const insights = await getLearningInsights(currentStudentData);
        renderAiInsights(insights);

    } catch (error) {
        console.error("Dashboard rendering failed:", error);
    }
}

// --- Event Listeners ---
const navButtons = document.querySelectorAll('.nav-btn');
const pages = document.querySelectorAll('.page');

navButtons.forEach(button => {
    button.addEventListener('click', async () => {
        // Remove active class from all buttons
        navButtons.forEach(btn => btn.classList.remove('active'));
        // Add active class to the clicked button
        button.classList.add('active');

        // Hide all pages
        pages.forEach(page => page.classList.remove('active'));

        // Show the target page
        const targetPageId = button.dataset.target + '-page';
        const targetPage = document.getElementById(targetPageId);
        if (targetPage) {
            targetPage.classList.add('active');
            const pageType = button.dataset.target;

            if (pageType === 'overview') {
                fetchDataAndRender();
            } else if (pageType === 'trends') {
                const trendsData = await getTrendsData();
                renderTrendsCharts(trendsData);
            } else if (pageType === 'scores') {
                const scoresData = await getScoresData();
                renderScoresCharts(scoresData);
            } else if (pageType === 'dropouts') {
                const dropoutsData = await getDropoutsData();
                renderDropoutsCharts(dropoutsData);
            }
            // Predictor page doesn't need data fetched on navigation, only on button click
        }
    });
});

if (predictBtn) {
    predictBtn.addEventListener('click', async () => {
        const hours = parseFloat(inputHours.value);
        const quiz = parseFloat(inputQuiz.value);
        const days = parseFloat(inputDays.value);

        if (isNaN(hours) || isNaN(quiz) || isNaN(days)) {
            showError('Please enter valid numbers for prediction inputs.');
            return;
        }

        const likelihood = await predictCompletion(hours, quiz, days);
        if (predictResult && likelihood !== null) {
            predictResult.textContent = `${(likelihood * 100).toFixed(1)}%`;
        } else if (predictResult) {
            predictResult.textContent = 'Prediction failed.';
        }
    });
}

if (searchInput) {
    searchInput.addEventListener('input', () => {
        const searchTerm = searchInput.value.toLowerCase();
        if (searchTerm.length > 0 && currentStudentData.length > 0) {
            const filteredStudents = currentStudentData.filter(student => {
                // Search across relevant string fields
                return (student.gender && student.gender.toLowerCase().includes(searchTerm)) ||
                       (student.race_ethnicity && student.race_ethnicity.toLowerCase().includes(searchTerm)) ||
                       (student.parental_level_of_education && student.parental_level_of_education.toLowerCase().includes(searchTerm)) ||
                       (student.lunch && student.lunch.toLowerCase().includes(searchTerm)) ||
                       (student.test_preparation_course && student.test_preparation_course.toLowerCase().includes(searchTerm));
            });
            renderSearchResults(filteredStudents);
        } else {
            if (searchResults) {
                searchResults.style.display = 'none'; // Hide results if search term is empty
            }
        }
    });
}

// --- Initial Load ---
document.addEventListener('DOMContentLoaded', () => {
    // Activate the overview button and show the overview page by default
    const overviewButton = document.querySelector('.nav-btn[data-target="overview"]');
    if (overviewButton) {
        overviewButton.classList.add('active');
        document.getElementById('overview-page').classList.add('active');
    }
    fetchDataAndRender();
});

// --- Theme Toggle (Placeholder) ---
const themeToggle = document.getElementById('themeToggle');
if (themeToggle) {
    themeToggle.addEventListener('click', () => {
        document.body.classList.toggle('dark-theme'); // Example class toggle
        // You would implement actual theme switching logic here
        console.log('Theme toggle clicked!');
    });
}