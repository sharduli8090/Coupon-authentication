// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.9.2/firebase-app.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

import {
  getAuth,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
} from "https://www.gstatic.com/firebasejs/9.9.2/firebase-auth.js";

import {
  getFirestore,
  collection,
  getDoc,
  getDocs,
  doc,
  deleteDoc,
  updateDoc,
  setDoc,
} from "https://www.gstatic.com/firebasejs/9.9.2/firebase-firestore.js";
// Your web app's Firebase configuration
import { firebaseConfig } from "./cred.js";
// Initialize Firebase
const app = initializeApp(firebaseConfig);

const auth = getAuth();

//User logged in or not check
onAuthStateChanged(auth, (user) => {
  if (user) {
    // User is signed in, see docs for a list of available properties
    document.getElementById("userdiv").style.display = "flex";
    document.getElementById("cont").style.display = "none";
    document.getElementById("tableCoupon").style.display = "flex";

    //Check the logged in user

    var user = auth.currentUser;
    console.log(user);
    if (user != null) {
      var email_id = user.email;
      var div = document.createElement("div");
      div.setAttribute("id", "welcomeText");
      div.innerHTML = "Welcome : " + email_id;
      document.getElementById("useremail").innerHTML = "";
      document.getElementById("useremail").appendChild(div);
      // document.getElementById("useremail").innerHTML = "Welcome : " + email_id;
    }
  } else {
    // User is signed out
    document.getElementById("userdiv").style.display = "none";
    document.getElementById("cont").style.display = "flex";
  }
});

//Logging in the user with email address and password
async function loginUser() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("pass").value;
  signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      // Signed in
      const user = userCredential.user;
      alert("You have successfully logged in!");
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      alert("Error signing in!");
    });
}

//Logging out the user
async function logoutUser() {
  const auth = getAuth();
  signOut(auth)
    .then(() => {
      // Sign-out successful.
      alert("Logged out successfully!");

      location.reload(); //reload the current page
    })
    .catch((error) => {
      // An error happened.
      alert("An error occurred!");
    });
}

// Initialize Firebase
const db = getFirestore();

//adding userdata in firestore database
async function addUser() {
  const id = document.getElementById("id").value;
  const code = document.getElementById("code").value.toUpperCase();
  const name = document.getElementById("name").value;

  var colRef = doc(db, "coupons", id);
  const docSnap = await getDoc(colRef);
  console.log(id);

  if (!docSnap.exists()) {
    //add user doesnot exist
    //Adding time stamp and changing status
    let timeStamp = Date.now();
    await setDoc(doc(db, "coupons", id), {
      status: true,
      time: new Date(timeStamp),
      id: id,
      code: code,
      name: name,
    });
    alert("User added successfully");
    location.reload();
  } else {
    alert("User is already added!");
    location.reload();
  }
}

//  TODO: Get all data from firestore database and show in a table

const querySnapshot = await getDocs(collection(db, "coupons"));
var person = [];
var tbody = document.getElementById("tbody1");
querySnapshot.forEach((doc) => {
  person.push(doc.data());
  // console.log(doc.id);
});
//Calling the function to pass the list of all person
addAllDataToTable(person);

//Adding element to table
function addElementToTable(name, id, coupon, status) {
  //Create table row
  var trow = document.createElement("tr");
  var td1 = document.createElement("td");
  var td2 = document.createElement("td");
  var td3 = document.createElement("td");
  var td4 = document.createElement("td");
  var td5 = document.createElement("td");

  td1.innerHTML = id;
  td2.innerHTML = name;
  td3.innerHTML = coupon;
  td4.innerHTML = status;

  let inputBox = document.createElement("input");
  inputBox.setAttribute("type", "checkbox");
  inputBox.setAttribute("value", id);
  inputBox.setAttribute("class", "checkBox");
  td5.appendChild(inputBox);

  if (status == false) {
    trow.style.backgroundColor = "rgba(171, 27, 27, 0.2)";
  }

  trow.appendChild(td1);
  trow.appendChild(td2);
  trow.appendChild(td3);
  trow.appendChild(td4);
  trow.appendChild(td5);

  tbody.appendChild(trow);
}

//Add all the data in the table one by one from firestore database
function addAllDataToTable(docsList) {
  tbody.innerHTML = "";
  docsList.forEach((element) => {
    addElementToTable(element.name, element.id, element.code, element.status);
  });
}

//Deleting user
async function deleteUser() {
  const idList = document.getElementsByClassName("checkBox");

  for (let i = 0; i < idList.length; i++) {
    //Checking if the check box is checked
    var status = idList[i].checked;
    //Getting the id value of the checkbox
    var id = idList[i].value;

    if (status == true) {
      await deleteDoc(doc(db, "coupons", id));
    }
  }
  alert("User deleted successfully!");
  location.reload();
}

//Update user profile
async function updateUser() {
  const idList = document.getElementsByClassName("checkBox");

  for (let i = 0; i < idList.length; i++) {
    //Checking if the check box is checked
    let boxStatus = idList[i].checked;
    //Getting the id value of the checkbox
    var id = idList[i].value;
    var colRef = doc(db, "coupons", id);
    const docSnap = await getDoc(colRef);

    if (boxStatus == true) {
      if (docSnap.data().status == true) {
        await updateDoc(colRef, {
          status: false,
        });
      } else {
        await updateDoc(colRef, {
          status: true,
        });
      }
    }
  }
  alert("Coupon Updated successfully!");
  location.reload();
}

document.getElementById("login").addEventListener("click", loginUser);
document.getElementById("logout").addEventListener("click", logoutUser);
document.getElementById("add").addEventListener("click", addUser);
document.getElementById("delete").addEventListener("click", deleteUser);
document.getElementById("update").addEventListener("click", updateUser);
