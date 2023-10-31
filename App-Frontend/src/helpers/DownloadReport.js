import { sdk } from "./CorsSessionHelper";

// Function that downloads the Dashboard into a PDF
export const handleDownload = async (id, setLoadingDownload) => {
  try {
    setLoadingDownload(true);
    // Starts by creating a dashboard render task with the dashboard ID, result format and height/width
    // https://docs.looker.com/reference/api-and-integration/api-reference/v4.0/render-task#create_dashboard_render_task
    let response = await sdk.ok(
      sdk.create_dashboard_render_task({
        dashboard_id: id,
        result_format: "pdf",
        width: 1200,
        height: 1200,
        body: {},
      }),
    );

    // Initialize a variable for the do while loop
    let rendered = false;

    // A do while loop to check the statuse of the render task
    do {
      // Getting the status of the render task by passing the render task id to the endpoint render_task
      // https://docs.looker.com/reference/api-and-integration/api-reference/v4.0/render-task#get_render_task
      let task = await sdk.ok(sdk.render_task(response.id));

      // Check if the status is success to break out of the loop
      if (task.status === "success") {
        rendered = true;
      }
    } while (rendered === false);

    // The task has finished rendering and can get the result which is returned as a Blob
    let blob = await sdk.ok(sdk.render_task_results(response.id));
    // Create a url to open the blob in another tab
    const pdfUrl = URL.createObjectURL(blob);
    window.open(pdfUrl, "_blank");
    setLoadingDownload(false);
  } catch (error) {
    setLoadingDownload(false);
    console.log(error);
  }
};
