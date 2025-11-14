const API_BASE_URL = 'http://127.0.0.1:5000/api';

// --- DOM Elements ---
const startDateInput = document.getElementById('startDate');
const endDateInput = document.getElementById('endDate');
const totalStudentsElem = document.getElementById('totalStudents');
const completionRateElem = document.getElementById('completionRate');
const averageScoreElem = document.getElementById('averageScore');
const scoreDistributionChartElem = document.getElementById('scoreDistributionChart');
const engagementCorrelationChartElem = document.getElementById('engagementCorrelationChart');
const aiInsightsElem = document.getElementById('aiInsights');
const loadingIndicator = document.getElementById('loading');
const errorDisplay = document.getElementById('error');

// --- Helper Functions ---
function showLoading() {
    loadingIndicator.style.display = 'block';
    errorDisplay.style.display = 'none';
}

function hideLoading() {
    loadingIndicator.style.display = 'none';
}

function showError(message) {
    errorDisplay.textContent = `Error: ${message}`;
    errorDisplay.style.display = 'block';
}

function clearError() {
    errorDisplay.style.display = 'none';
    errorDisplay.textContent = '';
}

// --- API Calls ---
async function getDashboardData(startDate, endDate) {
    clearError();
    showLoading();
    try {
        let url = `${API_BASE_URL}/dashboard-data`;
        const params = new URLSearchParams();

        if (startDate) {
            params.append('start_date', startDate);
        }
        if (endDate) {
            params.append('end_date', endDate);
        }

        if (params.toString()) {
            url += `?${params.toString()}`;
        }

        const response = await fetch(url);
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

// --- Rendering Functions ---
function renderStats(stats) {
    totalStudentsElem.textContent = stats.totalStudents;
    completionRateElem.textContent = `${stats.completionRate}%`;
    averageScoreElem.textContent = stats.averageScore;
}

function renderScoreDistributionChart(studentData) {
    scoreDistributionChartElem.innerHTML = ''; // Clear previous chart

    if (!studentData || studentData.length === 0) {
        scoreDistributionChartElem.textContent = 'No data for score distribution.';
        return;
    }

    const scoreBins = [
        { name: '0-59 (Fail)', count: 0 },
        { name: '60-69 (Pass)', count: 0 },
        { name: '70-79 (Good)', count: 0 },
        { name: '80-89 (Very Good)', count: 0 },
        { name: '90-100 (Excellent)', count: 0 },
    ];

    studentData.forEach(student => {
        const score = (student.math_score + student.reading_score + student.writing_score) / 3;
        if (score < 60) scoreBins[0].count++;
        else if (score < 70) scoreBins[1].count++;
        else if (score < 80) scoreBins[2].count++;
        else if (score < 90) scoreBins[3].count++;
        else scoreBins[4].count++;
    });

    const ul = document.createElement('ul');
    scoreBins.forEach(bin => {
        const li = document.createElement('li');
        const percentage = studentData.length > 0 ? (bin.count / studentData.length) * 100 : 0;
        li.innerHTML = `
            <span>${bin.name}</span>
            <span>${bin.count} (${percentage.toFixed(1)}%)</span>
            <div class="bar-container"><div class="bar" style="width: ${percentage}%;"></div></div>
        `;
        ul.appendChild(li);
    });
    scoreDistributionChartElem.appendChild(ul);
}

function renderEngagementCorrelationChart(studentData) {
    engagementCorrelationChartElem.innerHTML = ''; // Clear previous chart

    if (!studentData || studentData.length === 0) {
        engagementCorrelationChartElem.textContent = 'No data for performance by test preparation.';
        return;
    }

    const groupedData = {};
    studentData.forEach(student => {
        const testPrep = student.test_prep_course === 'none' ? 'No Prep' : 'Completed Prep';
        const averageScore = (student.math_score + student.reading_score + student.writing_score) / 3;

        if (!groupedData[testPrep]) {
            groupedData[testPrep] = { totalScore: 0, count: 0 };
        }
        groupedData[testPrep].totalScore += averageScore;
        groupedData[testPrep].count++;
    });

    const chartData = Object.keys(groupedData).map(key => ({
        name: key,
        averageScore: groupedData[key].totalScore / groupedData[key].count,
    }));

    const ul = document.createElement('ul');
    chartData.forEach(item => {
        const li = document.createElement('li');
        li.innerHTML = `
            <span>${item.name}</span>
            <span>${item.averageScore.toFixed(1)}</span>
            <div class="bar-container"><div class="bar" style="width: ${item.averageScore}%;"></div></div>
        `;
        ul.appendChild(li);
    });
    engagementCorrelationChartElem.appendChild(ul);
}

function renderAiInsights(insights) {
    aiInsightsElem.innerHTML = insights;
}

// --- Main Data Fetching and Rendering ---
async function fetchDataAndRender() {
    try {
        const dashboardData = await getDashboardData(startDateInput.value, endDateInput.value);
        renderStats(dashboardData.stats);
        renderScoreDistributionChart(dashboardData.studentData);
        renderEngagementCorrelationChart(dashboardData.studentData);
        
        // Fetch AI insights separately
        const insights = await getLearningInsights(dashboardData.studentData);
        renderAiInsights(insights);

    } catch (error) {
        // Error already shown by getDashboardData or getLearningInsights
        console.error("Dashboard rendering failed:", error);
    }
}

// --- Event Listeners ---
startDateInput.addEventListener('change', fetchDataAndRender);
endDateInput.addEventListener('change', fetchDataAndRender);

// --- Initial Load ---
document.addEventListener('DOMContentLoaded', fetchDataAndRender);
