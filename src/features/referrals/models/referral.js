export class Referral {
  constructor(data) {
    this.id = data.id;
    this.name = data.name;
    this.postalCode = data.postalCode;
    this.phone = data.phone;
    this.pin = data.pin;
    this.referrerId = data.referrerId; // id_user que lo registró
    this.latitude = data.latitude;
    this.longitude = data.longitude;
    this.registrationDate = data.registrationDate;
    this.courseProgress = data.courseProgress || [];
  }
} 