import React from "react";

import { render, cleanup, fireEvent, prettyDOM } from "@testing-library/react";
import {
  getByText,
  findByText,
  getAllByTestId,
  getByAltText,
  getByPlaceholderText,
  queryByText
} from "@testing-library/react";

import Application from "components/Application";

afterEach(cleanup);

describe("Appointment", () => {
  //asynchronous test using asyn/await
  //async function has been defined as one using the async keyword
  //the promise chain can be hidden by using the await keyword
  it("defaults to Monday and changes the schedule when a new day is selected", async () => {
    const { queryByText, getByText, findByText } = render(<Application />);

    await findByText("Monday");

    fireEvent.click(getByText("Tuesday"));
    expect(queryByText("Leopold Silvers")).toBeInTheDocument();
  });

});

describe("Application", () => {
  it("loads data, books an interview and reduces the spots remaining for the first day by 1",
    async () => {
      // 1. Render the Application.
      const { container, debug } = render(<Application />);

      // 2. Wait until the text "Archie Cohen" is displayed.
      await findByText(container, "Archie Cohen");

      // 3. Click the "Add" button on the first empty appointment.
      const appointments = getAllByTestId(container, "appointment");
      const appointment = appointments[0];
    
      fireEvent.click(getByAltText(appointment, "Add"));
    
      // 4. Enter the name "Lydia Miller-Jones" into the input with the placeholder "Enter Student Name".
      fireEvent.change(getByPlaceholderText(appointment, /enter student name/i), {
        target: { value: "Lydia Miller-Jones" },
      });
    
      // 5. Click the first interviewer in the list.
      fireEvent.click(getByAltText(appointment, "Sylvia Palmer"));
      // 6. Click the "Save" button on that same appointment.
      fireEvent.click(getByText(appointment, "Save"));
    
      // 7. Check that the element with the text "Saving" is displayed.
      expect(getByText(appointment, "Saving")).toBeInTheDocument();
    
      // 8. Wait until the element with the text "Lydia Miller-Jones" is displayed.
      await findByText(appointment, "Lydia Miller-Jones");

    // 9. Check that the DayListItem with the text "Monday" also has the text "no spots remaining".
      const day = getAllByTestId(container, "day").find((day) => queryByText(day, "Monday"));    
      expect(getByText(day, "no spots remaining")).toBeInTheDocument();
    });
});