import { useEffect } from "react";
import {
  Features,
  Footer,
  Header,
  Hero,
  Highlights,
  HowItWorks,
  Model,
} from "./components";
import * as Sentry from "@sentry/react";

function App() {
  useEffect(() => {
    // Simulating an error that will be captured by Sentry
    try {
      throw new Error("This is a test error to create an issue in Sentry.");
    } catch (error) {
      Sentry.captureException(error); // This will create an issue in Sentry
    }
  }, []);
  return (
    <div>
      <Header />
      <Hero />
      <Highlights />
      <Model />
      <Features />
      <HowItWorks />
      <Footer />
    </div>
  );
}

export default App;
