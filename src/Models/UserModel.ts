class UserModel {
  username: string;
  password: string;
  role: boolean;
  createdBy: string;

  constructor(
    username: string,
    password: string,
    role: boolean,
    createdBy: string
  ) {
    this.username = username;
    this.password = password;
    this.role = role;
    this.createdBy = createdBy;
  }
}

export default UserModel;
