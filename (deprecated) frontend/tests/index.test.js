import Navbar from '../components/navbar/Navbar'
import "@testing-library/jest-dom";
import { fireEvent, render, screen } from "@testing-library/react";


import { GoogleOAuthProvider } from "@react-oauth/google";

describe("Navbar", () => {
    it("renders a navbar", () => {
        const oAuthClientId = process.env.GOOGLE_OAUTH_ID;
        render(
            <GoogleOAuthProvider clientId={oAuthClientId}>
                <Navbar />
            </GoogleOAuthProvider>);
        // check if all components are rendered
        expect(screen.getByTestId("navbar")).toBeInTheDocument();
    });
});