class RfiMailer < ApplicationMailer

  # Subject can be set in your I18n file at config/locales/en.yml
  # with the following lookup:
  #
  #   en.rfi_mailer.send_rfi.subject
  #
  def send_rfi(rfi)
    @rfi = rfi
    mail to: @rfi.client_team_member.email,
         subject: "Project #{@rfi.project.project_number}:
                    New RFI Created - #{@rfi.rfi_number}",
         from: @rfi.project.user.email
  end
end
