

import avatar1_profile from "../avatars/avatar1/profile.png";
import avatar1_welcome from "../avatars/avatar1/welcome.png";
import avatar1_cheerful from "../avatars/avatar1/cheerful.png";
import avatar1_sad from "../avatars/avatar1/sad.png";
import avatar2_profile from "../avatars/avatar2/profile.png";
import avatar2_welcome from "../avatars/avatar2/welcome.png";
import avatar2_cheerful from "../avatars/avatar2/cheerful.png";
import avatar2_sad from "../avatars/avatar2/sad.png";
import avatar3_profile from "../avatars/avatar3/profile.png";

// Repeat for other avatars...

export interface Avatar {
  id: string;
  name: string;
  profile: string;
  welcome: string;
  cheerful: string;
  sad: string;
}

export const avatars: Avatar[] = [
  {
    id: "avatar1",
    name: "Avatar 1",
    profile: avatar1_profile,
    welcome: avatar1_welcome,
    cheerful: avatar1_cheerful,
    sad: avatar1_sad,
  },
  {
    id: "avatar2",
    name: "Avatar 2",
    profile: avatar2_profile,
    welcome: avatar2_welcome,
    cheerful: avatar2_cheerful,
    sad: avatar2_sad,
  },
];
