document.addEventListener("DOMContentLoaded", () => {
    // DOM elements
    let dom = {
        toggle: document.querySelector("#toggle"),
        main: document.querySelector("main"),
        searchBox: document.querySelector(".search-container"),
        body: document.body,
        topic: document.querySelector("#topic"),
        btn: document.querySelector("#analyze-btn"),
        sentiment: document.querySelector("#sentiment"),
        posts: document.querySelector("#posts"),
        results: document.querySelector("#results")
    };

    // Switching between dark/light themes
    if (dom.toggle) {
        dom.toggle.addEventListener("click", toggleMode);
    }

    function toggleMode() {
        if (dom.body.classList.contains("lightmode")) {
            dom.toggle.setAttribute("class", "fa-solid fa-sun");
            dom.body.classList.remove("lightmode");
            dom.body.classList.add("darkmode");
        } else {
            dom.toggle.setAttribute("class", "fa-solid fa-moon");
            dom.body.classList.remove("darkmode");
            dom.body.classList.add("lightmode");
        }
    }

    // Mock Posts
    const mockPosts = [
        { text: "Tesla's killing it!", sentiment: "positive" },
        { text: "Elon's nuts, stock's toast.", sentiment: "negative" },
        { text: "Just another day at Tesla.", sentiment: "neutral" },
    ];

    // Render resulted pulse
    if (dom.btn) {
        dom.btn.addEventListener("click", showPulse);
    }

    function showPulse() {
        const topic = dom.topic.value.trim();
        if (!topic) {
            alert("Gimme a topic, fam!");
            return;
        }
        const filteredPosts = mockPosts;
        const sentiment = calcSentiment(filteredPosts);
        renderResults(sentiment, filteredPosts);
        drawChartSentiment(sentiment); // Pass sentiment here
    }

    function calcSentiment(posts) {
        const count = { positive: 0, negative: 0, neutral: 0 };
        if (!posts.length) {
            return count;
        }
        posts.forEach(post => count[post.sentiment]++);
        const total = posts.length;
        return {
            positive: Math.round((count.positive / total) * 100),
            negative: Math.round((count.negative / total) * 100),
            neutral: Math.round((count.neutral / total) * 100)
        };
    }

    function renderResults(sentiment, posts) {
        dom.sentiment.textContent = `${dom.topic.value} Pulse: ${sentiment.positive}% , ${sentiment.negative}% , ${sentiment.neutral}%`;
        dom.posts.innerHTML = posts.map(p => `<li>${p.text} (${p.sentiment})</li>`).join("");
        dom.results.classList.add("show");
    }

    function drawChartSentiment(sentiment) {
        const chartCanvas = document.querySelector("#sentiment-chart");
        if (!chartCanvas) {
            new console.error("Chart canvas not found");
            return;
        }

        const ctx = chartCanvas.getContext("2d");

        // Destroy existing chart if present
        if (window.myChart) {
            window.myChart.destroy();
        }

        window.myChart = new Chart(ctx, {
            type: "pie",
            data: {
                labels: ["Positive", "Negative", "Neutral"],
                datasets: [{
                    data: [sentiment.positive, sentiment.negative, sentiment.neutral],
                    backgroundColor: ["#17bf63", "#e0245e", "#8899a6"],
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: { position: "top" },
                    title: {
                        display: true,
                        text: `${dom.topic.value} Sentiment Breakdown`
                    }
                }
            }
        });
    }
});
