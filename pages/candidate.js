import React, { useContext, useState, useCallback, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import { VotingContext } from "../context/Voter";
import Style from "../styles/Cand.module.css";
import Image from "next/image";
import Loder from "../components/Loder/Loder"
import images from "../assets";
import Button from "../components/Button/Button";
import { ethers } from "ethers";
import Input from "../components/Input/Input";

const RegisterCandidate = () => {
  const [fileUrl, setFileUrl] = useState(null);
  const [loading,setLoading]=useState(false)
  const [formInput, setFormInput] = useState({
    address:"",
    name: "",
    age: "",
    image: null,
    ipfs: null,
  });

  const { uploadToIPFS, registerCandidate,candidateArray,pushCandedate} = useContext(VotingContext);

  // Handle file drop and upload to IPFS
  const onDrop = useCallback(async (acceptedFiles) => {
    if (acceptedFiles.length === 0) {
      console.log("No files accepted");
      return;
    }

    const selectedFile = acceptedFiles[0];
    const url = await uploadToIPFS(selectedFile);

    if (url) {
      setFileUrl(url);
      setFormInput({ ...formInput, image: url, ipfs: url });
      alert(`File uploaded successfully: ${url}`);
    }
    console.log(url);
  }, [uploadToIPFS, formInput]);

  const { getRootProps, getInputProps } = useDropzone({
    accept: "image/*",
    onDrop,
    maxSize: 5000000, // 5 MB
    onDropRejected: (fileRejections) => {
      alert(
        "File Rejected: " +
          fileRejections.map((file) => file.errors[0].message).join(", ")
      );
    },
  });

  const handleSubmit = async () => {
    const { name, age, image, ipfs } = formInput;
    if (!name || !age || !image || !ipfs) {
      alert("All fields are required!");
      return;
    }
    await registerCandidate(name, age, image, ipfs);
  };
useEffect(() => {
  pushCandedate;
});
console.log("Dwsqd",pushCandedate);

  return (
    <div className={Style.createVoter}>
            {loading && <Loder />}

    {/* Candidate Information Section */}
    <div>
      {fileUrl ? (
        <div className={Style.voterInfoBox}>
          <div className={Style.imageContainer}>
            <Image
              src={formInput.image}
              alt="Candidate Image"
              width={180}
              height={180}
            />
          </div>
          <div className={Style.voterInfo_para}>
            <p>Name: {formInput.name || "Enter name below"}</p>
            <p>Age: {formInput.age || "Enter age below"}</p>
            <p>
              Address: {formInput.address.slice(0,10) || "Enter address below"}
            </p>
          </div>
        </div>
      ) : (
        <div className={Style.sideInfo}>
          <div className={Style.sideInfo_box}>
            <h4>Register as a Candidate</h4>
            <p>We Vote is a Blockchain-based voting system.</p>
            <p className={Style.sideInfo_para}>
              Name: {formInput.name || "Enter name below"}
            </p>
            <p className={Style.sideInfo_para}>
              Age: {formInput.age || "Enter age below"}
            </p>
            <p className={Style.sideInfo_para}>
              Address: {formInput.address.slice(0,10) || "Enter address below"}
            </p>
          </div>
        </div>
      )}
    </div>
 {/* Registered Candidates List */}


    {/* Candidate Registration Form */}
    <div className={Style.voter}>
      <div className={Style.voter_container}>
        <h1>Register as a Candidate</h1>

        <div className={Style.voter_container_box}>
          <div {...getRootProps()} className={Style.voter_container_box_div}>
            <input {...getInputProps()} />
            <div className={Style.voter_container_box_div_input}>
              <p>Choose an image (JPG, PNG) for Candidate</p>
              <div className={Style.voter_container_box_div_image}>
                <Image
                  alt="File Upload"
                  src={images.upload}
                  width={150}
                  height={150}
                />
              </div>
              <p>Drag and Drop or Click to Upload</p>
            </div>
          </div>
        </div>
        <div className={Style.input_container}>
          <Input
            inputType="text"
            title="Address"
            placeholder="Candidate Address"
            value={formInput.address}
            onChange={(e) =>
              setFormInput({ ...formInput, address: e.target.value })
            }
          />
        </div>
        <div className={Style.input_container}>
          <Input
            inputType="text"
            title="Name"
            placeholder="Candidate Name"
            value={formInput.name}
            onChange={(e) =>
              setFormInput({ ...formInput, name: e.target.value })
            }
          />
        </div>
        <div className={Style.input_container}>
          <Input
            inputType="text"
            title="Age"
            placeholder="Candidate Age"
            value={formInput.age}
            onChange={(e) =>
              setFormInput({ ...formInput, age: e.target.value })
            }
          />
        </div>

        <div className={Style.input_container1}>
          <Button
            btnName="Register Candidate"
            handleClick={()=>registerCandidate(formInput.address,formInput.name,formInput.age,formInput.image,formInput.ipfs)}
            />
        </div>
      </div>
    </div>
  </div>
);
};

export default RegisterCandidate;
