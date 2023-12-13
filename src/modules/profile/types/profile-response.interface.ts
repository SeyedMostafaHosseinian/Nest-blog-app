export interface ProfileInterface {
  username: string;
  image: string;
  biography: string;
  following: boolean;
}

export interface ProfileResponseInterface {
  profile: ProfileInterface;
}
