export const fetchJobs = async () => {
  try {
    console.log("Fetching jobs...");

    const response = await fetch("https://empllo.com/api/v1");
    console.log("Response status:", response.status);

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const json = await response.json();
    console.log("Fetched Data:", JSON.stringify(json, null, 2));

    if (!json || !json.jobs) {
      throw new Error("No jobs found in the API response.");
    }

    return json.jobs.slice(0, 100);

  } catch (error: any) {
    console.error("Error fetching jobs:", error.message);
    return []; 
  }
};
