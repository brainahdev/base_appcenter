package com.rentnride;

import android.app.Application;

import com.babisoft.ReactNativeLocalization.ReactNativeLocalizationPackage;
import com.burnweb.rnwebview.RNWebViewPackage;
import com.facebook.CallbackManager;
import com.facebook.react.ReactApplication;
import com.burnweb.rnwebview.RNWebViewPackage;
import com.oblador.vectoricons.VectorIconsPackage;
import com.goldenowl.twittersignin.TwitterSigninPackage;
import com.babisoft.ReactNativeLocalization.ReactNativeLocalizationPackage;
import com.imagepicker.ImagePickerPackage;
import com.idehub.GoogleAnalyticsBridge.GoogleAnalyticsBridgePackage;
import com.facebook.reactnative.androidsdk.FBSDKPackage;
import com.learnium.RNDeviceInfo.RNDeviceInfo;
import org.reactnative.camera.RNCameraPackage;
import com.microsoft.appcenter.reactnative.crashes.AppCenterReactNativeCrashesPackage;
import com.microsoft.appcenter.reactnative.analytics.AppCenterReactNativeAnalyticsPackage;
import com.microsoft.appcenter.reactnative.appcenter.AppCenterReactNativePackage;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.modules.i18nmanager.I18nUtil;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.reactnative.androidsdk.FBSDKPackage;
import com.facebook.soloader.SoLoader;
import com.goldenowl.twittersignin.TwitterSigninPackage;
import com.idehub.GoogleAnalyticsBridge.GoogleAnalyticsBridgePackage;
import com.imagepicker.ImagePickerPackage;
import com.oblador.vectoricons.VectorIconsPackage;
import com.reactlibrary.googlesignin.RNGoogleSignInPackage;

import org.reactnative.camera.RNCameraPackage;

import java.util.Arrays;
import java.util.List;

public class MainApplication extends Application implements ReactApplication {
  private static CallbackManager mCallbackManager = CallbackManager.Factory.create();

  protected static CallbackManager getCallbackManager() {
    return mCallbackManager;
  }

  private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {
    @Override
    public boolean getUseDeveloperSupport() {
      return BuildConfig.DEBUG;
    }

    @Override
    protected List<ReactPackage> getPackages() {
      return Arrays.<ReactPackage>asList(
          new MainReactPackage(),
            new RNWebViewPackage(),
            new VectorIconsPackage(),
            new TwitterSigninPackage(),
            new ReactNativeLocalizationPackage(),
            new ImagePickerPackage(),
            new GoogleAnalyticsBridgePackage(),
            new FBSDKPackage(),
            new RNDeviceInfo(),
            new RNCameraPackage(),
            new AppCenterReactNativeCrashesPackage(MainApplication.this, getResources().getString(R.string.appCenterCrashes_whenToSendCrashes)),
            new AppCenterReactNativeAnalyticsPackage(MainApplication.this, getResources().getString(R.string.appCenterAnalytics_whenToEnableAnalytics)),
            new AppCenterReactNativePackage(MainApplication.this),
            new ReactNativeLocalizationPackage(),
            new VectorIconsPackage(),
            new RNCameraPackage(),
            new ImagePickerPackage(),
            new GoogleAnalyticsBridgePackage(),
            new TwitterSigninPackage(),
            new RNGoogleSignInPackage(),
              new RNWebViewPackage(),
            new FBSDKPackage(mCallbackManager)
      );
    }
  };

  @Override
  public ReactNativeHost getReactNativeHost() {
    return mReactNativeHost;
  }

  @Override
  public void onCreate() {
    super.onCreate();
    I18nUtil sharedI18nUtilInstance = I18nUtil.getInstance();
    sharedI18nUtilInstance.allowRTL(getApplicationContext(), false);
    SoLoader.init(this, /* native exopackage */ false);
  }
}
