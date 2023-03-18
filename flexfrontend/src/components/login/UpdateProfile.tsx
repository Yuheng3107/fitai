import React, { useState, useRef } from 'react';

import { backend } from '../../App';



function UpdateProfile() {
    const endpoint = `${backend}/users/user/update`;

    const [usernameInput, setUsernameInput] = useState("");
    const [passwordInput, setPasswordInput] = useState("");
    const [emailInput, setEmailInput] = useState("");
    const [filePath, setFilePath] = useState("");
    const fileInputRef = useRef<HTMLInputElement>(null);


    function createUserHandler(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        const fileInput = fileInputRef.current?.files?.[0];
        if (!fileInput) {
            console.log("no file input");
            return;
        }
        let profilePhotoFormData = new FormData();
        profilePhotoFormData.append("photo", fileInput);

        interface Data {
            email?: string;
            privacy_level?: number;
            username?: string;
        }
        let data: Data = {};
        if (emailInput !== "") {
            data["email"] = emailInput;
        }
        if (usernameInput !== "") {
            data["username"] = usernameInput;
        }

        console.log(fileInput);

        fetch(`${backend}/users/user/update`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "X-CSRFToken": String(
                    document.cookie?.match(/csrftoken=([\w-]+)/)?.[1]
                ),
            },
            credentials: "include",
            body: JSON.stringify(data),
        }).then((response) => {
            // do something with response
            console.log(response);
        });
        fetch(`${backend}/users/user/update/profile_photo`, {
            method: "POST",
            headers: {
                "X-CSRFToken": String(
                    document.cookie?.match(/csrftoken=([\w-]+)/)?.[1]
                ),
            },
            credentials: "include",
            body: profilePhotoFormData,
        }).then((response) => {
            // do something with response
            console.log(response);
        });
    }

    return <div>
        <h1>Create User</h1>
        <form onSubmit={createUserHandler}>
            <label htmlFor="profilePhoto">Upload Profile Photo</label>
            <input
                ref={fileInputRef}
                onChange={(e) => {
                    setFilePath(e.target.value);
                    console.log(e.target.value);
                }}
                className="border border-neutral-500"
                type="file"
                name="profilePhoto"
            />

            <div>
                <label htmlFor="username">Username</label>
                <input
                    onChange={(e) => setUsernameInput(e.target.value)}
                    className="border border-neutral-500"
                    type="text"
                    name="username"
                />
            </div>

            <div>
                <label htmlFor="email">Email</label>
                <input
                    onChange={(e) => setEmailInput(e.target.value)}
                    className="border border-neutral-500"
                    type="email"
                    name="email"
                />
            </div>

            <div>
                <label htmlFor="password">Password</label>
                <input
                    className="border border-neutral-500"
                    type="password"
                    name="password"
                />
            </div>

            <div>
                <label htmlFor="confirmPassword">Confirm Password</label>
                <input
                    className="border border-neutral-500"
                    type="password"
                    name="confirmPassword"
                />
            </div>

            <div>
                <label htmlFor="confirmPassword">Privacy Level</label>
                <input
                    className="border border-neutral-500 w-20"
                    type="number"
                    name="confirmPassword"
                    step="1"
                    min="0" max="3"
                />
            </div>

            <input className="border border-neutral-500" type="submit" />
        </form>
    </div>
}

export default UpdateProfile;