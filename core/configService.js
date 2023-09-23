class ConfigService {
  setSetting(setting) {
    Object.assign(this, setting);
  }

  get httpOrigin() {
    return this.baseUrl.replace('Api/', '');
  }
}

export const configService = new ConfigService();
