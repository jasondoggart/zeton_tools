FactoryBot.define do
  factory :rfi_response do
    response "A response to a request"
    information_request
    organization "Zeton"
    responder "JD"
  end
end
