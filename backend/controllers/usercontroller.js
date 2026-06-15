const user = require("../models/userm");
const bcrypt = require("bcrypt");
const { generatejwt, verifyjwt } = require("../utils/generatetoken");
const transporter = require("../utils/transporter");
const {
  FIREBASE_PROJECT_ID,
  FIREBASE_PRIVATE_KEY_ID,
  FIREBASE_PRIVATE_KEY,
  FIREBASE_CLIENT_EMAIL,
  FIREBASE_CLIENT_ID,
} = require("../config/dotenv.config");

const admin = require("firebase-admin");
const { getAuth } = require("firebase-admin/auth");



const ShortUniqueId = require("short-unique-id");
const { uploadimage, deleteimagefromcloud } = require("../utils/uploadimage");
const { EMAIL_USER, FRONTEND_URL } = require("../config/dotenv.config");

const uidInstance = new ShortUniqueId({ length: 10 });
const { randomUUID } = new ShortUniqueId({ length: 10 });

admin.initializeApp({
  credential: admin.credential.cert({
    type: "service_account",
    project_id: FIREBASE_PROJECT_ID,
    private_key_id: FIREBASE_PRIVATE_KEY_ID,
    private_key: FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n"),
    client_email: FIREBASE_CLIENT_EMAIL,
    client_id: FIREBASE_CLIENT_ID,
  }),
});



async function createuser(req, res) {
  console.log("SIGNUP HIT");
  console.log(req.body);

  const { name, password, email } = req.body;

  try {
    if (!name || !password || !email) {
      return res.status(400).json({
        success: false,
        message: "Please fill all fields",
      });
    }

    const check = await user.findOne({ email });
    console.log("CHECK:", check);


    // ---------------- USER EXISTS ----------------
    if (check) {
      if (check.googleAuth) {
        return res.status(400).json({
          success: false,
          message: "Email already registered with Google",
        });
      }

      if (check.verify) {
        return res.status(400).json({
          success: false,
          message: "User already exists",
        });
      }

      // resend verification
      const verificationtoken = await generatejwt({
        email: check.email,
        id: check._id,
      });

      try {
  const info = await transporter.sendMail({
        from: EMAIL_USER,
        to: check.email,
        subject: "Verify your email",
        html: `
          <h2>Verify your account</h2>
          <a href="${FRONTEND_URL}/verify-email/${verificationtoken}">
            Click to verify
          </a>
        `,

      });

  console.log("EMAIL SENT:", info.messageId);
} catch (err) {
  console.log("EMAIL FAILED:", err);
}

      // const info = transporter.sendMail({
      //   from: EMAIL_USER,
      //   to: check.email,
      //   subject: "Verify your email",
      //   html: `
      //     <h2>Verify your account</h2>
      //     <a href="${FRONTEND_URL}/verify-email/${verificationtoken}">
      //       Click to verify
      //     </a>
      //   `,

      // }).catch(err => console.log("Email error:", err.message));
      // console.log("inside if",info)

      return res.status(200).json({
        success: true,
        message: "Verification email sent again",
      });
    }

   
    const hashedpassword = await bcrypt.hash(password, 10);
    const username = email.split("@")[0] + uidInstance.rnd();

    const newuser = await user.create({
      name,
      email,
      password: hashedpassword,
      username,
    });

    console.log("NEWUSER:", newuser);

    const verificationtoken = await generatejwt({
      email: newuser.email,
      id: newuser._id,
    });

 

  
     try {
  const info = await transporter.sendMail({
        from: EMAIL_USER,
        to: newuser.email,
        subject: "Verify your email",
        html: `
          <h2>Verify your account</h2>
          <a href="${FRONTEND_URL}/verify-email/${verificationtoken}">
            Click to verify
          </a>
        `,

      });

  console.log("EMAIL SENT:", info.messageId);
} catch (err) {
  console.log("EMAIL FAILED:", err);
}

    return res.status(200).json({
      success: true,
      message: "User created. Check email to verify account.",
    });

  } catch (err) {
    console.error("SIGNUP ERROR:", err);
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
}



async function verifytoken(req, res) {
  try {
    const { verificationtoken } = req.params;

    const decoded = await verifyjwt(verificationtoken);

    if (!decoded) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired token",
      });
    }

    const updatedUser = await user.findByIdAndUpdate(
      decoded.id,
      { verify: true },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(400).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Email verified successfully",
    });

  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
}

/* ---------------- GOOGLE AUTH ---------------- */

async function googleAuth(req, res) {
  try {
    const { accessToken } = req.body;

    const decodedToken = await getAuth().verifyIdToken(accessToken);
    const { name, email } = decodedToken;

    let userauth = await user.findOne({ email });

    if (userauth) {
      const token = await generatejwt({
        email: userauth.email,
        id: userauth._id,
      });

      return res.status(200).json({
        success: true,
        message: "Login successful",
        user: {
        id: userauth._id,
        name: userauth.name,
        email: userauth.email,
        profilepic:userauth.profilepic,
        username:userauth.username,
        token,
        },
      });
    }

    const username = email.split("@")[0] + uidInstance.rnd();

    const newuser = await user.create({
      name,
      email,
      googleAuth: true,
      verify: true,
      username,
    });

    const token = await generatejwt({
      email: newuser.email,
      id: newuser._id,
    });

    return res.status(200).json({
      success: true,
      message: "Registered successfully",
      user: {
        id: newuser._id,
        name: newuser.name,
        email: newuser.email,
        profilepic:newuser.profilepic,
        username:newuser.username,
        token,

      },
    });

  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
}



async function login(req, res) {
  const { email, password } = req.body;

  try {
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please fill all fields",
      });
    }

    const check = await user
  .findOne({ email })
  .select(
    "+password verify name email profilepic username bio showlikeBlogs showsavedBlogs"
  );

    if (!check) {
      return res.status(400).json({
        success: false,
        message: "User not found",
      });
    }


console.log(check);
console.log("LOGIN BODY:", req.body);
console.log("DB USER:", check);
console.log("PASSWORD FROM BODY:", password);
console.log("PASSWORD FROM DB:", check.password);

    const match = await bcrypt.compare(password, check.password);

    if (!match) {
      return res.status(400).json({
        success: false,
        message: "Incorrect password",
      });
    }

    if (!check.verify) {
      return res.status(400).json({
        success: false,
        message: "Please verify your email first",
      });
    }

    const token = await generatejwt({
      email: check.email,
      id: check._id,
    });


  console.log("LOGIN USER RESPONSE:", {
  id: check._id,
  username: check.username,
  profilepic: check.profilepic,
});
    return res.status(200).json({
      success: true,
      message: "Login successful",
      user: {
        id: check._id,
        name: check.name,
        email: check.email,
        profilepic:check.profilepic,
        username:check.username,
        token,
      },
    });

  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
}



async function getuser(req, res) {
  try {
    const allusers = await user.find();
    return res.status(200).json({
      success: true,
      message: "user created successfully",
      allusers,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
}

async function getuserid(req, res) {
  try {
    const { id } = req.params;
    const username = req.params.username;
    console.log("username from params:", username);

    const userid = await user
      .findOne({ username })
      .populate("blogs following saveBlogs likeBlogs")
      .populate({
        path: "followers following",
        select: "name username ",
      })
      .select("-password -isVerify -__v -email -googleAuth ");

    if (!userid) {
      return res.status(200).json({
        success: false,
        message: "user not found",
      });
    }
    return res.status(200).json({
      success: true,
      message: "user created successfully",
      userid,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
}

async function updateuser(req, res) {
  try {
    const id = req.params.id;
    const { name, email, profilepic, bio, username } = req.body;
    const image = req.file;

    //
    const userone = await user.findById(id);

    if (!req.body.profilepic) {
      if (userone.profilepicid) {
        await deleteimagefromcloud(userone.profilepicid);
      }
      userone.profilepic = null;
      userone.profilepicid = null;
    }

    if (image) {
      const { secure_url, public_id } = await uploadimage(
        `data:image/jpeg;base64,${image.buffer.toString("base64")}`,
      );

      userone.profilepic = secure_url;
      userone.profilepicid = public_id;
    }

    if (userone.username !== username) {
      const finduser = await user.findOne({
        username,
      });

      if (finduser) {
        return res.status(400).json({
          success: false,
          message: "Username already taken",
        });
      }
      userone.username = username;
    }
    userone.bio = bio;
    userone.name = name;

    await userone.save();

    // const userupd =await user.findOneAndUpdate({_id: id},{name,email,profilepic,});
    res.status(200).json({
      success: true,
      message: "updated user data successfully",
      user: {
        name: userone.name,
        profilepic: userone.profilepic,
        bio: userone.bio,
        username: userone.username,
      },
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
}

async function deleteuser(req, res) {
  try {
    const id = req.params.id;
    const userdel = await user.findOneAndDelete({ _id: id });
    if (!userdel) {
      res.status(200).json({
        success: true,
        message: "user with particular id does not exist",
        userdel,
      });
    }

    res.status(200).json({
      success: true,
      message: "deleted successfully",
      userdel,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
}

async function followuser(req, res) {
  try {
    const creator = req.user;
    const id = req.params.id;

    const User = await user.findById(id);
    if (!User) {
      return res.status(400).json({
        message: "User is not found please do something different",
      });
    }

    if (!User.followers.includes(creator)) {
      await user.findByIdAndUpdate(id, { $set: { followers: creator } });
      await user.findByIdAndUpdate(creator, { $set: { following: id } });
      return res.status(200).json({
        success: true,
        message: "Follow",
      });
    } else {
      await user.findByIdAndUpdate(id, { $unset: { followers: creator } });
      await user.findByIdAndUpdate(creator, { $unset: { following: id } });
      return res.status(200).json({
        success: true,
        message: "Unfollwed",
      });
    }
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
}

async function changesavedlikeblog(req, res) {
  try {
    const creator = req.user;
    const User = await user.findById(creator);
    const { showlikeBlogs, showsavedBlogs } = req.body;
    console.log("BODY:", req.body);
    console.log("USER:", req.user);

    if (!User) {
      return res.status(400).json({
        message: "User is not found please do something different",
      });
    }

    const updatedUser = await user.findByIdAndUpdate(
      creator,
      {
        showsavedBlogs,
        showlikeBlogs,
      },
      { new: true },
    );

    console.log(updatedUser);

    return res.status(200).json({
      success: true,
      message: "Visibility updated",
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
}

module.exports = {
  createuser,
  getuser,
  getuserid,
  updateuser,
  deleteuser,
  login,
  verifytoken,
  googleAuth,
  followuser,
  changesavedlikeblog,
};
