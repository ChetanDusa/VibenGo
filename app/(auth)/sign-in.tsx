import { useSignIn } from "@clerk/clerk-expo";
import { Link, router, useRouter } from "expo-router";
import { useCallback, useState } from "react";
import { Alert, Image, ScrollView, Text, View } from "react-native";
// import { ReactNativeModal } from "react-native-modal";

import CustomButton from "@/components/CustomButton";
import InputField from "@/components/InputField";
import OAuth from "@/components/OAuth";
import { icons, images } from "@/constants";
// import { fetchAPI } from "@/lib/fetch";

const SignIn = () => {
  const { signIn, setActive, isLoaded } = useSignIn();
  const router=useRouter();

    const [form, setForm] = useState({
        email: "",
        password: "",
      });
      
    const onSignInPress = useCallback(async () => {
        if (!isLoaded) return;
    
        try {
          const signInAttempt = await signIn.create({
            identifier: form.email,
            password: form.password,
          });
    
          if (signInAttempt.status === "complete") {
            await setActive({ session: signInAttempt.createdSessionId });
            router.replace("/(root)/(tabs)/home");
          } else {
            // See https://clerk.com/docs/custom-flows/error-handling for more info on error handling
            console.log(JSON.stringify(signInAttempt, null, 2));
            Alert.alert("Error", "Log in failed. Please try again.");
          }
        } catch (err: any) {
          console.log(JSON.stringify(err, null, 2));
          Alert.alert("Error", err.errors[0].longMessage);
        }
      }, [isLoaded, form.email,form.password]);
    

  return (
    <ScrollView className="flex-1 bg-white">
      <View className="flex-1 bg-white">
        <View className="relative w-full h-[250px]">
          <Image source={images.signUpCar} className="z-0 w-full h-[250px]" />
          <Text className="text-2xl text-black font-JakartaSemiBold absolute bottom-5 left-5">
Welcome
          </Text>
        </View>
        <View className="p-5">
        
          <InputField
            label="Email"
            placeholder="Enter email"
            icon={icons.email}
            textContentType="emailAddress"
            value={form.email}
            onChangeText={(value) => setForm({ ...form, email: value })}
          />
          <InputField
            label="Password"
            placeholder="Enter password"
            icon={icons.lock}
            secureTextEntry={true}
            textContentType="password"
            value={form.password}
            onChangeText={(value) => setForm({ ...form, password: value })}
          />
          <CustomButton
            title="Sign In"
            onPress={onSignInPress}
            className="mt-6"
          />
          <OAuth />
          <Link
            href="/sign-up"
            className="text-lg text-center text-general-200 mt-10"
          >
            Don't have an account?{" "}
            <Text className="text-primary-500">Sign Up</Text>
          </Link>
        </View>
        {/* <ReactNativeModal
          isVisible={verification.state === "pending"}
          // onBackdropPress={() =>
          //   setVerification({ ...verification, state: "default" })
          // }
          onModalHide={() => {
            if (verification.state === "success") {
              setShowSuccessModal(true);
            }
          }}
        >
          <View className="bg-white px-7 py-9 rounded-2xl min-h-[300px]">
            <Text className="font-JakartaExtraBold text-2xl mb-2">
              Verification
            </Text>
            <Text className="font-Jakarta mb-5">
              We've sent a verification code to {form.email}.
            </Text>
            <InputField
              label={"Code"}
              icon={icons.lock}
              placeholder={"12345"}
              value={verification.code}
              keyboardType="numeric"
              onChangeText={(code) =>
                setVerification({ ...verification, code })
              }
            />
            {verification.error && (
              <Text className="text-red-500 text-sm mt-1">
                {verification.error}
              </Text>
            )}
            <CustomButton
              title="Verify Email"
              onPress={onPressVerify}
              className="mt-5 bg-success-500"
            />
          </View>
        </ReactNativeModal>
        <ReactNativeModal isVisible={showSuccessModal}>
          <View className="bg-white px-7 py-9 rounded-2xl min-h-[300px]">
            <Image
              source={images.check}
              className="w-[110px] h-[110px] mx-auto my-5"
            />
            <Text className="text-3xl font-JakartaBold text-center">
              Verified
            </Text>
            <Text className="text-base text-gray-400 font-Jakarta text-center mt-2">
              You have successfully verified your account.
            </Text>
            <CustomButton
              title="Browse Home"
              onPress={() => router.push(`/(root)/(tabs)/home`)}
              className="mt-5"
            />
          </View>
        </ReactNativeModal> */}
      </View>
    </ScrollView>
  );
};
export default SignIn;
