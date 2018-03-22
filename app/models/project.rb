class Project < ApplicationRecord
  validates_presence_of :project_number, :project_name, :client
  has_many :equipment
  has_many :instruments
  has_many :information_requests
  has_many :team_members
  has_many :users, through: :team_members
  has_many :documents
  has_many :handvalves
  has_many :action_items
  has_many :client_team_members
  has_many :client_documents
  belongs_to :user
  after_create :initialize_team_members



  def initialize_team_members
    self.team_members.create(role: "Project Manager", user: user)
  end

  def reporting_days_array
    if ready_to_report_metrics
      days = (self.project_start_date.to_datetime..self.project_end_date.to_datetime).to_a.select { |k| k.wday == 4 }
      days_formatted = []
      days.each_with_index do |day, i|
        days_formatted[i] = day.strftime("%b %-d, %Y")
      end
      days_formatted
    end
  end

  def ready_to_report_metrics
    self.project_start_date.present? and self.project_end_date.present?
  end


  def create_blank_metrics_hash_for(record)
    if ready_to_report_metrics
      reporting_days = self.reporting_days_array
      empty_array = []
      reporting_days.length.times do
        empty_array.push(0)
      end
      report = Hash.new
      record.metrics_attributes.each do |attr|
        report[attr.to_sym] = empty_array.dup
      end
      report
    end
  end

  def metrics_report_for(record)
    if ready_to_report_metrics
      reporting_days = self.reporting_days_array
      report = create_blank_metrics_hash_for record
      report.each do |key, array|
        counter = 0
        completed = record.where(:project => self, key => 1)
        completed.each do |item|
          reporting_days.each do |i|
            if counter == 0
              if (self.project_start_date.to_datetime...reporting_days[0].to_datetime).
                  include?(item["#{key.to_s}_completed_at"])
                report[key][counter] += 1
              end
            else
              if (reporting_days[counter-1].to_datetime...reporting_days[counter].to_datetime).include?(item["#{key.to_s}_completed_at"])
                report[key][counter] += 1
              end
            end
            counter += 1
          end
          counter = 0
        end
      end
      report
    end
  end

  def cumulative_metrics_report_for(record)
    if ready_to_report_metrics
      metrics = metrics_report_for record
      cumulative_metrics = create_blank_metrics_hash_for record
      cumulative_metrics.each do |key, array|
        array.each_with_index do |value, i|
          (0..i).each do |j|
            array[i] += metrics[key][j]
          end
        end
      end
    end
  end

  def metrics_summary_for(record)
    report = Hash.new
    records = record.where(:project => self)
    record.metrics_attributes.each do |attr|
      report[attr.to_sym] = {
        :required => 0,
        :complete => 0,
        :percent => 0.0
      }
    end
    report.each do |key, hash|
      # Set number of record required
      hash[:required] = records.where.not(key => 2).count
      hash[:complete] = records.where(key => 1).count
      hash[:percent] = (records.where(key => 1).count.to_f / records.where.not(key => 2).count.to_f * 100).round(1)
    end
  end

end
