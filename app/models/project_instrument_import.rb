class ProjectInstrumentImport
  include ActiveModel::Model

  attr_accessor :file

  def initialize(attributes={})
    attributes.each { |name, value| send("#{name}=", value) }
  end

  def persisted?
    false
  end

  def save
    if imported_project_instruments.map(&:valid?).all?
      imported_project_instruments.each(&:save!)
      true
    else
      imported_project_instruments.each_with_index do |inst, index|
        inst.errors.full_messages.each do |msg|
          errors.add :base, "Row #{index + 2}: #{msg}"
        end
      end
      false
    end
  end

  def imported_project_instruments
    @imported_project_instruments ||= load_imported_project_instruments
  end

  def load_imported_project_instruments
    spreadsheet = open_spreadsheet
    header = spreadsheet.row(1)
    (2..spreadsheet.last_row).map do |i|
      row = Hash[[header, spreadsheet.row(i)].transpose]
      instrument = Instrument.find_by_id(row["id"]) || Instrument.new
      instrument.attributes = row.to_hash.slice(*Instrument.accessible_attributes)
      instrument
    end
  end

  def open_spreadsheet
    case File.extname(file.original_filename)
    when ".csv" then Csv.new(file.path, nil, :ignore)
    when ".xls" then Excel.new(file.path, nil, :ignore)
    when ".xlsx" then Excelx.new(file.path, nil, :ignore)
    else raise "Unknown file type: #{file.original_filename}"
    end
  end
end
