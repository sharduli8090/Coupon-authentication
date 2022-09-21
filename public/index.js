// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.9.2/firebase-app.js";
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
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import { firebaseConfig } from "./cred.js";

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore();

async function checkCode() {
  const id = document.getElementById("id").value;
  const code = document.getElementById("code").value.toUpperCase();

  var colRef = doc(db, "coupons", id);
  const docSnap = await getDoc(colRef);
  console.log(id);

  if (!docSnap.exists()) {
    rejected();
  } else {
    if (docSnap.data().code == code && docSnap.data().status == true) {
      //Adding time stamp and changing status
      let timeStamp = Date.now();
      await updateDoc(colRef, {
        status: false,
        time: new Date(timeStamp),
      });

      // window.open("success.html", "_self");
      accepted();
    } else {
      // alert("It does not exist");
      // window.open("reject.html", "_self");
      rejected();
    }
  }
}

document.getElementById("submit").addEventListener("click", checkCode);

function rejected() {
  document.getElementById("cont").innerHTML = "";
  var img = document.createElement("img");
  img.setAttribute("src", "w.jpg");
  img.setAttribute("alt", "rejected");
  img.setAttribute("id", "rejectAcept");

  var element = document.getElementById("cont");
  element.appendChild(img);
  var div = document.createElement("div");
  // div.setAttribux
  div.setAttribute("class", "text-center display-6 texter");
  div.setAttribute("style", "font-weight:bold");
  div.innerHTML = "Wrong Coupon Code Entered!";
  element.appendChild(div);
  var btn = document.createElement("button");
  btn.setAttribute("id", "btnRejected");
  btn.setAttribute("class", "btn");
  btn.innerHTML = "Try Again";
  btn.setAttribute("onclick", "location.reload()");
  element.appendChild(btn);
}

function accepted() {
  document.getElementById("cont").innerHTML = "";
  var img = document.createElement("img");
  img.setAttribute(
    "src",
    "https://media.istockphoto.com/vectors/green-checkmark-vector-illustration-vector-id1133442802?k=20&m=1133442802&s=612x612&w=0&h=N3UvaUREpqMYVpOV7kUrQzgpVaCgddEi-LESGeAl_FI="
  );
  img.setAttribute("alt", "accepted");

  var element = document.getElementById("cont");
  element.appendChild(img);
  var div1 = document.createElement("div");
  div1.setAttribute("class", "text-center display-6 texter");
  div1.setAttribute("style", "font-weight:bold");
  div1.setAttribute("id", "accepted");
  div1.innerHTML = "Coupon Code Accepted";
  element.appendChild(div1);
  var btn = document.createElement("button");
  btn.setAttribute("id", "btnAccepted");
  btn.setAttribute("class", "btn");
  btn.innerHTML = "Enter another code";
  btn.setAttribute("onclick", "location.reload()");
  element.appendChild(btn);
}
