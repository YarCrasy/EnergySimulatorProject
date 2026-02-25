import { describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';

import FormReceiver from '@/components/adminComponents/formReceiver/FormReceiver.jsx';

describe('FormReceiver.jsx', () => {
  it('envía powerConsumption/x/y como number y respeta id al editar', () => {
    const onSave = vi.fn();
    render(
      <FormReceiver
        receiverToEdit={{ id: 7, name: 'R1', powerConsumption: 100, x: 1.2, y: 3.4 }}
        onSave={onSave}
        onCancel={() => {}}
      />,
    );

    fireEvent.change(screen.getByRole('textbox'), { target: { value: 'R2' } });
    const numberInputs = screen.getAllByRole('spinbutton');
    fireEvent.change(numberInputs[0], { target: { value: '250.5' } });
    fireEvent.change(numberInputs[1], { target: { value: '10.25' } });
    fireEvent.change(numberInputs[2], { target: { value: '20' } });

    fireEvent.click(screen.getByRole('button', { name: 'Guardar' }));

    expect(onSave).toHaveBeenCalledTimes(1);
    expect(onSave).toHaveBeenCalledWith({
      id: 7,
      name: 'R2',
      powerConsumption: 250.5,
      x: 10.25,
      y: 20,
    });
  });

  it('en modo creación envía id ausente y valores numéricos fallback a 0', () => {
    // Arrange
    const onSave = vi.fn();
    render(<FormReceiver onSave={onSave} onCancel={() => {}} />);

    // Act
    fireEvent.change(screen.getByLabelText('Nombre'), { target: { value: 'Nuevo receiver' } });
    fireEvent.change(screen.getByLabelText('Consumo (W)'), { target: { value: '0' } });
    fireEvent.change(screen.getByLabelText('Posición X'), { target: { value: '' } });
    fireEvent.change(screen.getByLabelText('Posición Y'), { target: { value: '' } });
    fireEvent.click(screen.getByRole('button', { name: 'Guardar' }));

    // Assert
    expect(onSave).toHaveBeenCalledWith({
      name: 'Nuevo receiver',
      powerConsumption: 0,
      x: 0,
      y: 0,
    });
    expect(screen.getByRole('heading', { name: 'Nuevo Receiver' })).toBeInTheDocument();
  });

  it('ejecuta onCancel al hacer click en "Cancelar"', () => {
    // Arrange
    const onCancel = vi.fn();
    render(<FormReceiver onSave={() => {}} onCancel={onCancel} />);

    // Act
    fireEvent.click(screen.getByRole('button', { name: 'Cancelar' }));

    // Assert
    expect(onCancel).toHaveBeenCalledTimes(1);
  });

  it('configura y limpia mensajes de validación personalizados', () => {
    // Arrange
    render(<FormReceiver onSave={() => {}} onCancel={() => {}} />);
    const nameInput = screen.getByLabelText('Nombre');
    const consumoInput = screen.getByLabelText('Consumo (W)');
    const nameValiditySpy = vi.spyOn(nameInput, 'setCustomValidity');
    const consumoValiditySpy = vi.spyOn(consumoInput, 'setCustomValidity');

    // Act
    fireEvent.invalid(nameInput);
    fireEvent.input(nameInput);
    fireEvent.invalid(consumoInput);
    fireEvent.input(consumoInput);

    // Assert
    expect(nameValiditySpy).toHaveBeenCalledWith('Por favor, ingrese el nombre del elemento');
    expect(nameValiditySpy).toHaveBeenCalledWith('');
    expect(consumoValiditySpy).toHaveBeenCalledWith(
      'Por favor, ingrese el consumo en watios del elemento',
    );
    expect(consumoValiditySpy).toHaveBeenCalledWith('');
  });

  it('en edición usa fallback vacío cuando receiverToEdit trae valores falsy', () => {
    // Arrange
    render(
      <FormReceiver
        receiverToEdit={{ id: 10, name: '', powerConsumption: 0, x: 0, y: 0 }}
        onSave={() => {}}
        onCancel={() => {}}
      />,
    );

    // Assert
    expect(screen.getByLabelText('Nombre')).toHaveValue('');
    expect(screen.getByLabelText('Consumo (W)')).toHaveValue(null);
    expect(screen.getByLabelText('Posición X')).toHaveValue(null);
    expect(screen.getByLabelText('Posición Y')).toHaveValue(null);
  });
});
