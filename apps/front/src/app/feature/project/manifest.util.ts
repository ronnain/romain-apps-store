export function generateManifestContent(
  ipaUrl: string,
  versionInfo: { bundleId: string; version: string; name: string }
): string {
  return `
    <?xml version="1.0" encoding="UTF-8"?>
    <!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
    <plist version="1.0">
      <dict>
        <key>items</key>
        <array>
          <dict>
            <key>assets</key>
            <array>
              <dict>
                <key>kind</key>
                <string>software-package</string>
                <key>url</key>
                <string>${ipaUrl}</string>
              </dict>
            </array>
            <key>metadata</key>
            <dict>
              <key>bundle-identifier</key>
              <string>${versionInfo.bundleId}</string>
              <key>bundle-version</key>
              <string>${versionInfo.version}</string>
              <key>kind</key>
              <string>software</string>
              <key>title</key>
              <string>${versionInfo.name}</string>
            </dict>
          </dict>
        </array>
      </dict>
    </plist>`;
}
