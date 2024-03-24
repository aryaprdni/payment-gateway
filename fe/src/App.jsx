import { useEffect, useState } from "react";
import axios from "axios";

function App() {
  const [diamonds, setDiamonds] = useState([]);
  const [token, setToken] = useState("");
  const [datas, setDatas] = useState({
    _id : '',
    diamond_id: '',
    status: '',
    sub_amount: null,
    quantity: null,
    created_at: '',
    updated_at: ''
  });

  const fetchDiamonds = async () => {
    try {
      const response = await axios.get("http://localhost:8080/api/v1/diamond");
      setDiamonds(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchDiamonds();
  }, []);

  const proccess = async (price) => {
    const data = {
      name: "uhuy",
      email: "tes@gmail.com",
      order_id: Math.floor(Math.random() * 1000000),
      gross_amount: price,
      finish_redirect: "http://localhost:5173"
    };

    const config = {
      headers: {
        "Content-Type": "application/json"
      }
    };

    try {
      const response = await axios.post("http://localhost:3000/api/payment/proccess-transaction", data, config);
      setToken(response.data.token);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (token) {
      window.snap.pay(token, {
        onSuccess: (result) => {
          localStorage.setItem("pembayaran", JSON.stringify(result));
          setToken("");
          handlePaymentSuccess();
        },
        onPending: (result) => {  
          localStorage.setItem("pembayaran", JSON.stringify(result));
          setToken("");
          handlePaymentSuccess();
        },
        onError: (error) => {
          console.log(error);
        },
        onClose: () => {
          console.log("customer closed the popup without finishing the payment");
          setToken("");
        }
      });
    }
  }, [token]);

  useEffect(() => {
    const midtransUrl = "https://app.sandbox.midtrans.com/snap/snap.js";

    let scriptTag = document.createElement("script");
    scriptTag.src = midtransUrl;

    const midtransClientKey = "SB-Mid-client-p_9lktcFC3J07rAX";
    scriptTag.setAttribute("data-client-key", midtransClientKey);

    document.head.appendChild(scriptTag);

    return () => {
      document.head.removeChild(scriptTag);
    };
  }, []);

  const handlePostTransaction = async (diamond) => {
    try {
      const data = {
        diamond_id: diamond.id,
        status: "pending",
        quantity: diamond.Quantity,
        sub_amount: diamond.Price
      };

      const token = "7460fe81-4959-4cc6-9010-bca5a2fec0a2"

      const config = {
        headers: {
          Authorization: token
        },
        "Content-Type": "application/json"
      };

      const response = await axios.post("https://6457-2001-448a-2061-10cc-c422-e5ea-f326-64a4.ngrok-free.app/api/transaction", data, config);

      setDatas(response.data.data);
      proccess(diamond.Price, diamond.id);
    } catch (error) {
      console.error("Error occurred while posting transaction:", error);
    }
  };
  console.log(datas); 

  const handlePostUpdateTransaction = async () => {
    try {
      const updateData = {
        diamond_id: datas.diamond_id,
        status: "success",
        quantity: datas.quantity,
        sub_amount: datas.sub_amount
      };

      const token = "7460fe81-4959-4cc6-9010-bca5a2fec0a2";
      const config = {
        headers: {
          Authorization: token
        },
        "Content-Type": "application/json"
      };

      const response = await axios.put(`https://6457-2001-448a-2061-10cc-c422-e5ea-f326-64a4.ngrok-free.app/api/update-transaction/${datas._id}`, updateData, config);
      console.log("berhasil update", response.data);
      await handleUserUpdate(response.data);
    } catch (error) {
      console.error("Error occurred while updating transaction:", error);
    }
  };

  const handlePaymentSuccess = async () => {
    const pembayaran = localStorage.getItem("pembayaran");
  
    if (pembayaran) {
      const paymentData = JSON.parse(pembayaran);
      if (paymentData.status_code === "200") {
        console.log("Payment successful!");

        await handlePostUpdateTransaction();

        window.location.reload();
      } else {
        console.error("Payment failed.");
      }
    } else {
      console.log("Payment is pending or failed. Waiting for payment...");
    }
  };

  const handleUserUpdate = async (data) => {
    try {
      localStorage.removeItem("pembayaran");
      const token = "7460fe81-4959-4cc6-9010-bca5a2fec0a2";
      const updateData = {
        diamond : data.quantity
      }
      const config = {
        headers: {
          Authorization: token
        },
        "Content-Type": "application/json"
      };
      const response = await axios.put("https://6457-2001-448a-2061-10cc-c422-e5ea-f326-64a4.ngrok-free.app/api/users/current", updateData, config);
      console.log("berhasil update", response.data);
    } catch (error) {
      console.error("Error occurred while updating user:", error);
    }
  }

  useEffect(() => {
    localStorage.removeItem("pembayaran");
  }, []); 

  return (
    <div style={{ margin: 20 }}>
      <h2>Diamonds:</h2>
      {diamonds.map((diamond, index) => (
        <div key={index} style={{ backgroundColor: "lightblue", margin: 10 }} onClick={() => handlePostTransaction(diamond)}>
          <img src={diamond.Image} alt={`Diamond ${index}`} />
          <p>{diamond.Price}</p>
          <p>{diamond.Quantity}</p>
        </div>
      ))}
    </div>
  );
}

export default App;
