import Lottie, { Options } from "react-lottie";

// Define the options for the Lottie animation
export const lottieOptions = (data: any): Options => ({
  loop: true,
  autoplay: true, // Loop animation
  animationData: data, // The animation data (your JSON)
  rendererSettings: {
    preserveAspectRatio: "xMidYMid slice",
  },
});
