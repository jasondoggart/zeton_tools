class Project < ApplicationRecord
  validates_presence_of :project_number, :project_name
  has_many :equipment
  has_many :instruments
  has_many :information_requests
  has_many :team_members
  belongs_to :user
  after_create :initialize_team_members

  def initialize_team_members
    self.team_members.create(role: "Project Manager")
    self.team_members.create(role: "Project Mentor")
    self.team_members.create(role: "Project Engineer")
    self.team_members.create(role: "Project Engineer")
    self.team_members.create(role: "Draftsperson")
    self.team_members.create(role: "Electrical Engineer")
    self.team_members.create(role: "Controls Engineer")
    self.team_members.create(role: "Mechanical Supervisor")
    self.team_members.create(role: "Electrical Supervisor")
    self.team_members.create(role: "Mechanical Lead Hand")
    self.team_members.create(role: "Electrical Lead Hand")

  end
end
