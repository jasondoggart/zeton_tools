class ProjectExtractImport
  include ActiveModel::Model
  require 'roo'

  attr_accessor :file, :project

  def initialize(attributes = {})
    attributes.each { |name, value| send("#{name}=", value) }
  end

  def persisted?
    false
  end

  def save
    if imported_project_extract.map(&:valid?).all?
      imported_project_extract.each(&:save!)
      true
    else
      imported_project_extract.each_with_index do |item, index|
        item.errors.full_messages.each do |msg|
          errors.add :base, msg
        end
      end
      false
    end
  end

  def imported_project_extract
    @imported_project_extract ||= load_imported_project_extract
  end

  def load_imported_project_extract
    imported = []
    spreadsheet = open_spreadsheet
    handvalves_sheet = spreadsheet.sheet('Valves')
    (2..handvalves_sheet.last_row).map do |h|
      handvalve = Handvalve.new
      handvalve.tag = handvalves_sheet.cell('A', h)
      handvalve.project_id = project
      imported << handvalve
    end
    instruments_sheet = spreadsheet.sheet('Instruments')
    (2..instruments_sheet.last_row).map do |i|
      instrument = Instrument.new
      instrument.type_code = instruments_sheet.cell('A', i)
      instrument.loop = instruments_sheet.cell('B', i)
      instrument.project_id = project
      imported << instrument
    end
    # add equipment inmport - need to learn how ruby string methods
    imported
  end

  def open_spreadsheet
    case File.extname(file.original_filename)
    when ".csv" then Csv.new(file.path, nil, :ignore)
    when ".xls" then Roo::Excel.new(file.path)
    when ".xlsx" then Roo::Excelx.new(file.path)
    else raise "Unknown file type: #{file.original_filename}"
    end
  end
end
