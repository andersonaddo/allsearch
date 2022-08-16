import React from "react"
import { screen } from "@testing-library/react"
import { render } from "./test-utils"
import { MainSearch } from "../pages/MainSearch"

test("renders learn react link", () => {
  render(<MainSearch />)
  const linkElement = screen.getByText(/learn chakra/i)
  expect(linkElement).toBeInTheDocument()
})
