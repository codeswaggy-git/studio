
"use server";

import { assessContractRisk, AssessContractRiskInput, AssessContractRiskOutput } from "@/ai/flows/contract-risk-assessment";
import { generateGdprContract, GenerateGdprContractInput, GenerateGdprContractOutput } from "@/ai/flows/generate-gdpr-contract";
import { auth, db } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { getCurrentUser } from "@/lib/auth-utils";


export async function runContractRiskAssessment(
  data: AssessContractRiskInput
): Promise<{ success: boolean; data?: AssessContractRiskOutput; error?: string }> {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return { success: false, error: "User not authenticated." };
    }

    const result = await assessContractRisk(data);
    
    // Save to Firestore
    await addDoc(collection(db, "users", user.uid, "riskAssessments"), {
      userId: user.uid,
      contractText: data.contractText,
      assessmentResult: result,
      createdAt: serverTimestamp(),
    });

    return { success: true, data: result };
  } catch (error: any) {
    console.error("Error in runContractRiskAssessment:", error);
    return { success: false, error: error.message || "Failed to assess contract risk." };
  }
}

export async function runGenerateGdprContract(
  data: GenerateGdprContractInput
): Promise<{ success: boolean; data?: GenerateGdprContractOutput; error?: string }> {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return { success: false, error: "User not authenticated." };
    }
    
    const result = await generateGdprContract(data);

    // Save to Firestore
     await addDoc(collection(db, "users", user.uid, "gdprContracts"), {
      userId: user.uid,
      clientLocation: data.clientLocation,
      webDevelopmentDetails: data.webDevelopmentDetails,
      generatedContract: result,
      createdAt: serverTimestamp(),
    });

    return { success: true, data: result };
  } catch (error: any) {
    console.error("Error in runGenerateGdprContract:", error);
    return { success: false, error: error.message || "Failed to generate GDPR contract." };
  }
}
