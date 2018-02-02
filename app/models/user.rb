class User < ApplicationRecord
  include Clearance::User
  has_many :projects
  has_many :team_memberships, class_name: "TeamMember", foreign_key: "user_id"
  has_many :associated_projects, through: :team_memberships, source: :project
  has_many :documents_to_prepare, class_name: "Document", foreign_key: "prepared_by_id"
  has_many :documents_to_receive, class_name: "Document", foreign_key: "delivered_to_id"
  validates_presence_of :first_name, :last_name

  def all_projects
    (projects + associated_projects).uniq
  end

  def full_name
    first_name + " " + last_name
  end
end
