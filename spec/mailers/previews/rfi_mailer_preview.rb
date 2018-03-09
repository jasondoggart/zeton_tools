# Preview all emails at http://localhost:3000/rails/mailers/rfi_mailer
class RfiMailerPreview < ActionMailer::Preview

  # Preview this email at http://localhost:3000/rails/mailers/rfi_mailer/send_rfi
  def send_rfi
    rfi = InformationRequest.first
    RfiMailer.send_rfi(rfi)
  end

end
