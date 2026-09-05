import { Capacitor } from "@capacitor/core";
import { Camera, CameraResultType, CameraSource } from "@capacitor/camera";
import { PushNotifications } from "@capacitor/push-notifications";
import { Network } from "@capacitor/network";
import { StatusBar, Style } from "@capacitor/status-bar";

/**
 * Mobile Device Detection Helpers
 */
export const isNative = (): boolean => Capacitor.isNativePlatform();
export const isAndroid = (): boolean => Capacitor.getPlatform() === "android";
export const isIOS = (): boolean => Capacitor.getPlatform() === "ios";
export const isWeb = (): boolean => Capacitor.getPlatform() === "web";

/**
 * Initialize Mobile Status Bar & System UI
 */
export async function initializeMobileApp() {
  if (!isNative()) return;

  try {
    // Style status bar for dark/light themes
    await StatusBar.setStyle({ style: Style.Dark });
    if (isAndroid()) {
      await StatusBar.setBackgroundColor({ color: "#0f172a" });
    }
  } catch (error) {
    console.warn("Status bar initialization error:", error);
  }
}

/**
 * Capture or Scan Document via Camera
 * (Used for submitting assignments, profile pictures, and offline receipts)
 */
export async function captureDocument(): Promise<{ base64?: string; dataUrl?: string } | null> {
  if (isNative()) {
    try {
      const image = await Camera.getPhoto({
        quality: 90,
        allowEditing: true,
        resultType: CameraResultType.DataUrl,
        source: CameraSource.Prompt, // Allows choosing Camera or Gallery
      });
      return { dataUrl: image.dataUrl };
    } catch (error) {
      console.warn("Camera capture cancelled or failed:", error);
      return null;
    }
  }

  // Web Fallback: HTML file picker
  return new Promise((resolve) => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*,application/pdf";
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return resolve(null);
      const reader = new FileReader();
      reader.onload = () => resolve({ dataUrl: reader.result as string });
      reader.onerror = () => resolve(null);
      reader.readAsDataURL(file);
    };
    input.click();
  });
}

/**
 * Register Native Push Notifications
 */
export async function registerPushNotifications(): Promise<string | null> {
  if (!isNative()) {
    console.log("Push notifications use Web Push on browsers");
    return null;
  }

  try {
    let permStatus = await PushNotifications.checkPermissions();

    if (permStatus.receive === "prompt") {
      permStatus = await PushNotifications.requestPermissions();
    }

    if (permStatus.receive !== "granted") {
      console.warn("User denied push notifications permission");
      return null;
    }

    await PushNotifications.register();

    return new Promise((resolve) => {
      PushNotifications.addListener("registration", (token) => {
        console.log("Push registration success, token: " + token.value);
        resolve(token.value);
      });

      PushNotifications.addListener("registrationError", (err) => {
        console.error("Push registration error: ", err.error);
        resolve(null);
      });
    });
  } catch (error) {
    console.error("Push notification setup failed:", error);
    return null;
  }
}

/**
 * Check Real-time Network Connectivity
 */
export async function getNetworkStatus() {
  return await Network.getStatus();
}
