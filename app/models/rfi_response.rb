class RfiResponse < ApplicationRecord
  belongs_to :information_request
  validates_presence_of :response, :organization, :responder
end
