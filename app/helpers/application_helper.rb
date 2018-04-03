module ApplicationHelper

  def icon_select(value)
    case value
    when nil
      content_tag(:i, nil, class: 'far fa-times-circle')
    when 0
      content_tag(:i, nil, class: 'far fa-times-circle')
    when 1
      content_tag(:i, nil, class: 'far fa-check-circle')
    when 2
      content_tag(:i, nil, class: 'far fa-circle')
    end
  end

  def metrics_increment(value)
    if value == 0 or value == nil
      1
    elsif value == 1
      2
    else
      0
    end
  end

  def documents_metrics_increment(value)
    if value == 0 or value == nil
      1
    elsif value == 1
      0
    end
  end

  def rfi_status_update(value)
    if value == 0 or value == nil
      1
    else
      0
    end
  end

  def metrics_background_color(value)
    case value
    when nil
      "incomplete"
    when 0
      "incomplete"
    when 1
      "complete"
    when 2
      "not-required"
    end
  end

  def rfi_status_button(value)
    if value == 0 or value == nil
      'Open'
    else
      'Closed'
    end
  end

  def rfi_status_color(value)
    if value == 0 or value == nil
      'warning'
    else
      'success'
    end
  end

  def sort_direction(current_sort)
    current_direction = (current_sort =~ /asc$/) ? 'asc' : 'desc'
    current_direction == "asc" ? 'desc' : 'asc'
  end

  def metrics_color(value)
    case value
    when 0
      "text-warning"
    when 1
      "text-success"
    when 2
      "text-info"
    end
  end

  def days_from_now(value)
    ((value - Time.now)/24/3600 + 1).to_i
  end
end
