import React from "react";

import { render, cleanup, fireEvent } from "@testing-library/react";


import Application from "components/Application";

afterEach(cleanup);

describe("Appointment", () => {
  //asynchronous test using asyn/await
  //async function has been defined as one using the async keyword
  //the promise chain can be hidden by using the await keyword
  it("defaults to Monday and changes the schedule when a new day is selected", async () => {
    const { queryByText, getByText,findByText } = render(<Application />);
  
    await findByText("Monday");
  
    fireEvent.click(getByText("Tuesday"));
    expect(queryByText("Leopold Silvers")).toBeInTheDocument();
  });

});