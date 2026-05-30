import { ThemeProvider } from "./themeContext";

const Provider = ({ children }: { children: React.ReactNode }) => {
  return (
      <ThemeProvider>
        {children}
      </ThemeProvider>
  )
}

export default Provider
