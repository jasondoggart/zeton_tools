class User < ApplicationRecord
  include Clearance::User
  has_many :projects
  has_many :team_memberships, class_name: "TeamMember", foreign_key: "user_id"
end
