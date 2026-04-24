export type CertificateData = {
  school_name: string;
  crop_name: string;
  class_name: string;
  plot_label: string;

  start_date: string;
  end_date: string;
  days: number;

  irrigations: number;
  fertilizations: number;

  photo_url?: string;
  qr_token: string;
};
