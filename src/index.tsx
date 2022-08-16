import { ChakraProvider, ColorModeScript } from "@chakra-ui/react"
import * as ReactDOM from "react-dom/client"
import { BrowserRouter, Route, Routes } from "react-router-dom"
import reportWebVitals from "./analytics/reportWebVitals"
import { About } from "./pages/About"
import { MainSearch } from "./pages/MainSearch"
import { Settings } from "./pages/Settings"
import * as serviceWorker from "./serviceWorker"
import theme from "./styling/theme"
import { isInDevMove } from "./utils/utils"

const container = document.getElementById("root")
if (!container) throw new Error('Failed to find the root element');
const root = ReactDOM.createRoot(container)

//Whenever someone uses the button that changes the color scheme
//of allsearch, ChakraUI stores it in local storage so that all subsequent
//sessions use that option. This clears that cache so the next session will 
//still start with the system theme.
localStorage.removeItem("chakra-ui-color-mode")

root.render(
  <ChakraProvider theme={theme}>
    <ColorModeScript initialColorMode={theme.config.initialColorMode} />
    <BrowserRouter>
      <Routes>
        <Route path="settings" element={<Settings />} />
        <Route path="about" element={<About />} />
        <Route path="*" element={<MainSearch />} />
      </Routes>
    </BrowserRouter>
  </ChakraProvider>,
)


// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://cra.link/PWA
serviceWorker.unregister()

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
if (isInDevMove()) {
  reportWebVitals(console.log);
}

