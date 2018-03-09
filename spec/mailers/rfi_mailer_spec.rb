require "rails_helper"

RSpec.describe RfiMailer, type: :mailer do
  describe "send_rfi" do
    before do
      @rfi = FactoryBot.create(:information_request)
    end
    let(:mail) { RfiMailer.send_rfi(@rfi) }

    it "renders the headers" do
      expect(mail.subject).to eq("Project #{@rfi.project.project_number}:
                    New RFI Created - #{@rfi.rfi_number}")
      expect(mail.to).to eq(["#{@rfi.client_team_member.email}"])
      expect(mail.from).to eq(["#{@rfi.project.user.email}"])
    end

    it "renders the body" do
      expect(mail.body.encoded).to match("#{@rfi.zeton_clarification}")
    end
  end

end
