// URL for fetching data
const url = "https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json";

// Initialize the dashboard
function init() {
    const dropdownMenu = d3.select("#selDataset"); // Select the dropdown menu

    // Fetch JSON data
    d3.json(url).then(data => {
        const names = data.names; // Array of sample IDs

        // Populate dropdown menu with sample IDs
        names.forEach(name => {
            dropdownMenu.append("option")
                .text(name)
                .property("value", name);
        });

        // Display initial plots
        const initialSample = names[0];
        renderPlots(initialSample);
    });
}

// Render demographic panel
function renderDemographicInfo(selectedValue) {
    d3.json(url).then(data => {
        const metadata = data.metadata; // Array of metadata objects
        const filteredData = metadata.find(meta => meta.id == selectedValue); // Filter metadata for selected sample
        const panel = d3.select("#sample-metadata"); // Select the panel element

        // Clear previous demographic info
        panel.html("");

        // Display demographic info
        Object.entries(filteredData).forEach(([key, value]) => {
            panel.append("h5").text(`${key}: ${value}`);
        });
    });
}

// Render plots for selected sample
function renderPlots(selectedValue) {
    // Fetch JSON data
    d3.json(url).then(data => {
        const samples = data.samples; // Array of sample objects
        const filteredData = samples.find(sample => sample.id === selectedValue); // Filter samples for selected sample

        // Render bar chart
        renderBarChart(filteredData);

        // Render bubble chart
        renderBubbleChart(filteredData);

        // Render gauge chart
        renderGaugeChart(selectedValue);
    });
}

// Render bar chart
function renderBarChart(sampleData) {
    const trace = {
        x: sampleData.sample_values.slice(0, 10).reverse(),
        y: sampleData.otu_ids.slice(0, 10).map(otu_id => `OTU ${otu_id}`).reverse(),
        text: sampleData.otu_labels.slice(0, 10).reverse(),
        type: "bar",
        marker: { color: "rgb(166, 172, 237)" },
        orientation: "h"
    };

    const layout = {
        title: `Top 10 OTUs for Individual ${sampleData.id}`,
        xaxis: { title: "Sample Values" },
        yaxis: { title: "OTU ID" }
    };

    Plotly.newPlot("bar", [trace], layout);
}

// Render bubble chart
function renderBubbleChart(sampleData) {
    const trace = {
        x: sampleData.otu_ids,
        y: sampleData.sample_values,
        text: sampleData.otu_labels,
        mode: "markers",
        marker: {
            size: sampleData.sample_values,
            color: sampleData.otu_ids,
            colorscale: "Sunset"
        }
    };

    const layout = {
        xaxis: { title: "OTU ID" }
    };

    Plotly.newPlot("bubble", [trace], layout);
}

// Render gauge chart
function renderGaugeChart(selectedValue) {
    d3.json(url).then(data => {
        const metadata = data.metadata;
        const filteredData = metadata.find(meta => meta.id == selectedValue);
        const trace = {
            domain: { x: [0, 1], y: [0, 1] },
            value: filteredData.wfreq,
            title: { text: "<b>Belly Button Washing Frequency</b><br>Scrubs per Week", font: { size: 24 } },
            type: "indicator",
            mode: "gauge+number",
            gauge: {
                axis: { range: [null, 10] },
                bar: { color: "rgb(68, 166, 198)" },
                steps: [
                    { range: [0, 1], color: "rgb(233, 245, 248)" },
                    { range: [1, 2], color: "rgb(218, 237, 244)" },
                    { range: [2, 3], color: "rgb(203, 230, 239)" },
                    { range: [3, 4], color: "rgb(188, 223, 235)" },
                    { range: [4, 5], color: "rgb(173, 216, 230)" },
                    { range: [5, 6], color: "rgb(158, 209, 225)" },
                    { range: [6, 7], color: "rgb(143, 202, 221)" },
                    { range: [7, 8], color: "rgb(128, 195, 216)" },
                    { range: [8, 9], color: "rgb(113, 187, 212)" },
                    { range: [9, 10], color: "rgb(98, 180, 207)" }
                ]
            }
        };

        Plotly.newPlot("gauge", [trace]);
    });
}

// Event listener for dropdown change
function optionChanged(selectedValue) {
    renderDemographicInfo(selectedValue);
    renderPlots(selectedValue);
}

// Initialize the dashboard
init();





