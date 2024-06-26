import React from "react";
import axios from "axios";

import { render, cleanup, fireEvent, prettyDOM } from "@testing-library/react";
import {
  getByText,
  findByText,
  getAllByTestId,
  getByAltText,
  getByPlaceholderText,
  queryByText,
  queryByAltText,
  findByAltText
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

      debug();
    });


  it("loads data, cancels an interview and increases the spots remaining for Monday by 1", async () => {
    // 1. Render the Application.
    const { container, debug } = render(<Application />);

    // 2. Wait until the text "Archie Cohen" is displayed.
    await findByText(container, "Archie Cohen");

    // 3. Click the "Delete" button on the booked appointment.
    const appointment = getAllByTestId(container, "appointment").find((appointment) =>
      queryByText(appointment, "Archie Cohen")
    );

    fireEvent.click(queryByAltText(appointment, "Delete"));

    // 4. Check that the confirmation message is shown.
    expect(getByText(appointment, "Are you sure you would like to delete?")).toBeInTheDocument();

    // 5. Click the "Confirm" button on the confirmation.
    fireEvent.click(getByText(appointment, "Confirm"));

    // 6. Check that the element with the text "Deleting" is displayed.
    expect(getByText(appointment, "Deleting")).toBeInTheDocument();

    // 7. Wait until the element with the "Add" button is displayed.
    await findByAltText(appointment, "Add");

    // 8. Check that the DayListItem with the text "Monday" also has the text "2 spots remaining".
    const day = getAllByTestId(container, "day").find((day) => queryByText(day, "Monday"));
    expect(getByText(day, "2 spots remaining")).toBeInTheDocument();

    debug();
  });


  it("loads data, edits an interview and keeps the spots remaining for Monday the same", async () => {
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
      target: { value: "Me Me" },
    });

    // 5. Click the first interviewer in the list.
    fireEvent.click(getByAltText(appointment, "Sylvia Palmer"));
    // 6. Click the "Save" button on that same appointment.
    fireEvent.click(getByText(appointment, "Save"));

    // 7. Check that the element with the text "Saving" is displayed.
    expect(getByText(appointment, "Saving")).toBeInTheDocument();

    // 8. Wait until the element with the text "Me Me" is displayed.
    await findByText(appointment, "Me Me");

    // 9. Click the "Edit" button
    fireEvent.click(getByAltText(appointment, "Edit"));

    // 5. Change the student name from "Me Me" to "You You"
    fireEvent.change(getByPlaceholderText(appointment, /enter student name/i), {
      target: { value: "You You" },
    });
    // 6. Click the "Save" button on that same appointment.
    fireEvent.click(getByText(appointment, "Save"));

    // 7. Check that the element with the text "Saving" is displayed.
    expect(getByText(appointment, "Saving")).toBeInTheDocument();

    // . Check that the DayListItem with the text "Monday" also has the text "no spots remaining".
    const day = getAllByTestId(container, "day").find((day) => queryByText(day, "Monday"));
    expect(getByText(day, "no spots remaining")).toBeInTheDocument();

    debug();
  });


  it("shows the save error when failing to save an appointment", async () => {
    axios.put.mockRejectedValueOnce(new Error("Could not book appointment."));

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

    // 7. Check that the saving error message is displayed.
    await findByText(appointment, "Could not book appointment.")

    debug();
  });


  it("shows the delete error when failing to delete an existing appointment", async () => {
    axios.delete.mockRejectedValueOnce();

    // 1. Render the Application.
    const { container, debug } = render(<Application />);

    // 2. Wait until the text "Archie Cohen" is displayed.
    await findByText(container, "Archie Cohen");

    // 3. Click the "Delete" button on the booked appointment.
    const appointment = getAllByTestId(container, "appointment").find((appointment) =>
      queryByText(appointment, "Archie Cohen")
    );

    fireEvent.click(queryByAltText(appointment, "Delete"));

    // 4. Check that the confirmation message is shown.
    expect(getByText(appointment, "Are you sure you would like to delete?")).toBeInTheDocument();

    // 5. Click the "Confirm" button on the confirmation.
    fireEvent.click(getByText(appointment, "Confirm"));

    // 6. Check that the saving error message is displayed.
    // expect(getByText(appointment, "Could not cancel appointment.")).toBeInTheDocument();
    await findByText(appointment, "Could not cancel appointment.")

    debug();
  });

});