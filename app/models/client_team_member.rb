class ClientTeamMember < ApplicationRecord
  belongs_to :project
  has_many :information_requests
  validates_presence_of :first_name,
    :last_name,
    :email,
    :organization

  def full_name
    first_name + " " + last_name
  end
end
