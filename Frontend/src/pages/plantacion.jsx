import { useForm } from 'react-hook-form';
import { createTask } from '../api/plantaciones.api';

export function Taskform() {
    const { register, handleSubmit, formState: { errors } } = useForm();

    const onSubmit = handleSubmit(async (data) => {
        console.log('Datos enviados:', data);
        try {
            // No es necesario manejar tokens ni agregar encabezados
            await createTask(data);
            window.location.href = '/inicio-plantacion';
        } catch (error) {
            console.error('Error al crear la plantación:', error);
        }
    });

    return (
        <div>
            <form onSubmit={onSubmit}>
                <h2>Nombre de tu parcela</h2>
                <input
                    type="text"
                    placeholder="Nombre"
                    {...register("nombreParcela", { required: true })}
                />
                {errors.nombre && <span>Requerido</span>}
                <button>Crear</button>
            </form>
        </div>
    );
}
